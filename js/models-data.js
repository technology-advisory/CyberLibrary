(() => {
  'use strict';

  const ROOT = '/data/';
  const cacheBust = () => `?v=${Date.now()}`;
  const array = value => Array.isArray(value) ? value : value == null ? [] : [value];

  const first = (obj, keys, fallback = '') => {
    for (const key of keys) {
      const value = key.split('.').reduce((acc, part) => acc && acc[part], obj);
      if (value !== undefined && value !== null && value !== '') return value;
    }
    return fallback;
  };

  const list = (obj, keys) => array(first(obj, keys, [])).flatMap(value => {
    if (typeof value === 'string') return value.split(/[,;|]/).map(v => v.trim()).filter(Boolean);
    if (value && typeof value === 'object') {
      return Object.keys(value).filter(k => value[k] === true || value[k] === 1);
    }
    return value == null ? [] : [String(value)];
  });

  const slug = value => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const number = value => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    const parsed = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  };


  const unixTimestamp = value => {
    const parsed = number(value);
    if (parsed === null || parsed <= 0) return null;
    return parsed > 100000000000 ? Math.floor(parsed / 1000) : Math.floor(parsed);
  };

  const formatPublishedDate = value => {
    const timestamp = unixTimestamp(value);
    if (!timestamp) return 'No publicada';
    const date = new Date(timestamp * 1000);
    return Number.isNaN(date.getTime())
      ? 'No publicada'
      : new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date);
  };

  const getModels = payload => {
    if (Array.isArray(payload)) return payload;
    for (const key of ['models', 'modelos', 'items', 'data', 'catalog']) {
      if (Array.isArray(payload?.[key])) return payload[key];
    }
    return [];
  };

  const entries = payload => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object' || payload._replace_with_generated_file) return [];
    for (const key of ['items', 'data', 'providers', 'families', 'capabilities', 'pricing', 'changes']) {
      if (Array.isArray(payload[key])) return payload[key];
    }
    return Object.entries(payload)
      .filter(([key]) => !['generated_at', 'schema_version', 'version', 'metadata', 'summary', 'statistics', 'totals'].includes(key))
      .map(([id, value]) => typeof value === 'object' ? { id, ...value } : { id, value });
  };

  const capabilityNames = raw => {
    const names = [...list(raw, ['capabilities', 'features', 'tasks', 'supported_tasks', 'tags', 'supported_parameters'])];
    const flags = {
      supports_tools: 'Herramientas',
      supports_structured_outputs: 'Salidas estructuradas',
      supports_reasoning: 'Razonamiento',
      supports_vision: 'Visión',
      supports_audio: 'Audio',
      supports_video: 'Vídeo',
      supports_files: 'Archivos'
    };
    Object.entries(flags).forEach(([field, label]) => {
      if (raw?.[field] === true) names.push(label);
    });
    return [...new Set(names)];
  };


  const absoluteHttpUrl = value => {
    const text = String(value || '').trim();
    return /^https?:\/\//i.test(text) ? text : '';
  };

  const resolveSourceUrl = raw => {
    const explicit = first(raw, ['official_url', 'documentation_url', 'source_url', 'links.official', 'homepage'], '');
    if (absoluteHttpUrl(explicit)) return explicit;

    const source = String(first(raw, ['source.name', 'source', 'data_source', 'origin'], '')).toLowerCase();
    const modelId = String(first(raw, ['source_id', 'id', 'model_id', 'canonical_slug'], '')).trim();
    const huggingFaceId = String(first(raw, ['hugging_face_id'], '')).trim();

    if (source.includes('hugging') && modelId) return `https://huggingface.co/${modelId}`;
    if (source.includes('openrouter') && modelId) return `https://openrouter.ai/${modelId}`;
    if (huggingFaceId) return `https://huggingface.co/${huggingFaceId}`;

    return absoluteHttpUrl(first(raw, ['url', 'links.details'], ''));
  };

  const normalize = raw => {
    const input = list(raw, ['input_modalities', 'modalities.input', 'input', 'inputs']);
    const output = list(raw, ['output_modalities', 'modalities.output', 'output', 'outputs']);
    const modalities = [...new Set([...input, ...output, ...list(raw, ['modalities', 'modality'])])];
    const capabilities = capabilityNames(raw);
    const id = String(first(raw, ['id', 'model_id', 'slug', 'key', 'identifier', 'name'], ''));
    const name = String(first(raw, ['name', 'display_name', 'model_name', 'title'], id || 'Modelo sin nombre'));
    const provider = String(first(raw, ['provider.name', 'provider', 'provider_name', 'vendor', 'organization', 'owner'], 'Sin identificar'));
    const family = String(first(raw, ['family.name', 'family', 'family_name', 'model_family', 'series'], 'Sin clasificar'));
    const context = number(first(raw, ['context_length', 'context_window', 'max_context_length', 'limits.context', 'context', 'max_tokens'], null));
    const pricing = first(raw, ['pricing', 'price', 'cost'], null);
    const createdUnix = unixTimestamp(first(raw, ['created_unix'], null));
    const free = first(raw, ['is_free'], false) === true;
    const priceClass = String(first(
      raw,
      ['price_category', 'pricing_category', 'pricing.tier', 'pricing_type'],
      free ? 'Gratuito' : pricing ? 'Con precio publicado' : 'Sin precio publicado'
    ));

    return {
      raw,
      id,
      slug: slug(id || name),
      name,
      provider,
      family,
      description: String(first(raw, ['description', 'summary', 'overview', 'details'], 'Sin descripción pública disponible.')),
      source: String(first(raw, ['source.name', 'source', 'data_source', 'origin'], 'Catálogo público')),
      sourceUrl: resolveSourceUrl(raw),
      license: String(first(raw, ['license.name', 'license', 'licence', 'license_type'], 'Por validar')),
      openness: String(first(raw, ['openness', 'access_type', 'availability', 'deployment_type'], 'No especificado')),
      input,
      output,
      modalities,
      capabilities,
      context,
      pricing,
      priceClass,
      created: String(first(raw, ['created_date', 'created_at', 'release_date', 'released_at', 'date_created', 'created_unix'], '')),
      createdUnix,
      publishedLabel: formatPublishedDate(createdUnix),
      updated: String(first(raw, ['last_modified', 'updated_at', 'last_updated', 'modified_at', 'date_updated'], '')),
      status: String(first(raw, ['status', 'lifecycle_status', 'availability_status'], 'Activo')),
      parameters: first(raw, ['parameters', 'parameter_count', 'params', 'size'], ''),
      architecture: first(raw, ['architecture', 'model_type', 'type', 'tokenizer'], ''),
      firstSeenAt: String(first(raw, ['first_seen_at'], '')),
      lastSeenAt: String(first(raw, ['last_seen_at'], '')),
      lastUpdatedAt: String(first(raw, ['last_updated_at'], '')),
      isNew: first(raw, ['is_new'], false) === true,
      isUpdated: first(raw, ['is_updated'], false) === true,
      contextLabel: context ? new Intl.NumberFormat('es-ES').format(context) + ' tokens' : 'No publicado'
    };
  };

  async function json(path, optional = false) {
    try {
      const response = await fetch(ROOT + path + cacheBust(), { cache: 'no-store' });
      if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (optional) return {};
      throw error;
    }
  }

  async function loadModelsPayload() {
    const primary = await json('models.json', true);
    if (getModels(primary).length) return primary;

    const legacy = await json('modelos.json', true);
    if (getModels(legacy).length) return legacy;

    throw new Error('No se encontraron modelos en data/models.json ni en data/modelos.json.');
  }

  const indexByModelId = payload => {
    const map = new Map();
    entries(payload).forEach(item => {
      const id = String(first(item, ['model_id', 'id'], ''));
      if (id) map.set(id, item);
    });
    return map;
  };

  async function load() {
    const [modelsPayload, changesPayload, providersPayload, familiesPayload, capabilitiesPayload, pricingPayload, statisticsPayload, versionPayload] = await Promise.all([
      loadModelsPayload(),
      json('modelos-cambios.json', true),
      json('providers.json', true),
      json('families.json', true),
      json('capabilities.json', true),
      json('pricing.json', true),
      json('public_statistics.json', true),
      json('version.json', true)
    ]);

    const capabilityMap = indexByModelId(capabilitiesPayload);
    const pricingMap = indexByModelId(pricingPayload);
    const rawModels = getModels(modelsPayload).map(model => ({
      ...model,
      ...(capabilityMap.get(String(model.id || model.model_id)) || {}),
      ...(pricingMap.get(String(model.id || model.model_id)) || {}),
      id: model.id || model.model_id
    }));

    const metadata = modelsPayload.metadata || {};
    const providers = entries(providersPayload);
    const families = entries(familiesPayload);
    const capabilities = entries(capabilitiesPayload);
    const pricing = entries(pricingPayload);

    const statistics = statisticsPayload._replace_with_generated_file ? {} : statisticsPayload;
    const resolvedStatistics = {
      ...statistics,
      model_count: first(statistics, ['model_count', 'models', 'total_models'], metadata.model_count || rawModels.length),
      provider_count: first(statistics, ['provider_count', 'providers', 'total_providers'], metadata.provider_count || providers.length),
      family_count: first(statistics, ['family_count', 'families', 'total_families'], metadata.family_count || families.length)
    };

    const version = versionPayload._replace_with_generated_file ? {} : versionPayload;
    const resolvedVersion = {
      ...version,
      engine_version: first(version, ['engine_version', 'version'], metadata.engine_version || ''),
      generated_at_utc: first(version, ['generated_at_utc', 'generated_at', 'published_at'], metadata.generated_at_utc || '')
    };

    return {
      models: rawModels.map(normalize),
      rawModels: modelsPayload,
      changes: entries(changesPayload),
      providers,
      families,
      capabilities,
      pricing,
      statistics: resolvedStatistics,
      version: resolvedVersion,
      generatedAt: first(modelsPayload, ['generated_at', 'generatedAt', 'metadata.generated_at_utc', 'metadata.generated_at'], resolvedVersion.generated_at_utc || '')
    };
  }

  window.ModelsData = { load, normalize, first, list, array, slug, number, entries };
})();
