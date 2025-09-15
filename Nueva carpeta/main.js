document.addEventListener('DOMContentLoaded', () => {
  // --- LÓGICA DE LA APLICACIÓN PRINCIPAL ---
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    document.getElementById('menu-open-icon').classList.toggle('hidden');
    document.getElementById('menu-close-icon').classList.toggle('hidden');

    const themeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (isDark) => document.documentElement.classList.toggle('dark', isDark);
    applyTheme(themeMatcher.matches);
    themeMatcher.addEventListener('change', (e) => applyTheme(e.matches));

    const menuLinks = document.querySelectorAll('.menu-link');
    const contentPanels = document.querySelectorAll('.content-panel');

    const setActiveLink = (link) => {
      menuLinks.forEach(l => l.classList.remove('menu-link-active'));
      if (link) {
        link.classList.add('menu-link-active');
        const parentDetails = link.closest('details');
        if (parentDetails && !parentDetails.open) {
          parentDetails.open = true;
        }
      }
    };

    const showPanel = (panelId) => {
      contentPanels.forEach(p => p.classList.add('hidden'));
      const panelToShow = document.getElementById(panelId);
      if (panelToShow) {
        panelToShow.classList.remove('hidden');
      }
    };

    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const panelId = link.getAttribute('data-panel');

        // Si el enlace tiene 'data-panel', entonces es un botón interno.
        // ¡Solo en ese caso prevenimos que siga el enlace!
        if (panelId) {
          e.preventDefault(); // ¡AHORA SÓLO ACTÚA CUANDO DEBE!
          showPanel(panelId);
          setActiveLink(link);
          if (panelId === 'panel-guia') {
            const guiaTabs = document.getElementById('guia-tabs');
            if (guiaTabs) { guiaTabs.querySelector('[data-tab="presentacion"]').click(); }
          }
          if (panelId === 'panel-prov-contacto' && !providersLoaded) {
            loadProviderData();
          }
          if (panelId === 'panel-cronograma' && !cronogramaLoaded) {
            loadCronogramaData();
          }
        }
        // Si NO tiene 'data-panel' (como los que modificamos), 
        // esta función no hará nada y el navegador abrirá el enlace 'href' normalmente.

        if (window.innerWidth < 768) {
          sidebar.classList.add('-translate-x-full');
          document.getElementById('menu-open-icon').classList.remove('hidden');
          document.getElementById('menu-close-icon').classList.add('hidden');
        }
      });
    });

    const initialLink = document.querySelector('[data-panel="panel-consulta"]');
    setActiveLink(initialLink);
    showPanel('panel-consulta');

    const civilTeamData = {
      name: 'Nombre del Director/a',
      role: 'Director General de Mantenimiento',
      funciones: 'Responsable final de todas las áreas de mantenimiento.',
      children: [
        // Nicolas Grosso y todo su equipo ahora son "hijos" del nuevo Director.
        {
          name: 'Nicolas Grosso',
          role: 'Gerente Civil',
          funciones: 'Responsable del departamento de Obras y Proyectos Civiles.',
          children: [
            {
              name: 'Victoria Canepa',
              role: 'Líder de Equipamiento',
              funciones: 'Supervisa a los coordinadores de obras y proyectos asignados.',
              children: [
                { name: 'Leonardo Velazquez', role: 'Coordinador de equipamiento', funciones: 'Gestión y seguimiento de equipamiento en zona sur.' },
                { name: 'Carlos Romeo', role: 'Coordinador de equipamiento', funciones: 'Gestión y seguimiento de equipamiento en zona norte.' },
                { name: 'Kevin Paya', role: 'Analista de equipamiento', funciones: 'Análisis y reportería de estado de equipamiento.' }
              ]
            },
            { name: 'Martin Ingeniere', role: 'Coordinador de Obras', funciones: 'Coordinación de obras civiles en zona CABA.' },
            { name: 'Paula Cirillo', role: 'Coordinador de Obras', funciones: 'Coordinación de obras civiles en GBA Oeste.' },
            { name: 'Florencia Vargas', role: 'Coordinador de Obras', funciones: 'Coordinación de obras civiles en GBA Norte.' },
            { name: 'Matias Fadon', role: 'Coordinador de Obras', funciones: 'Coordinación de obras civiles en GBA Sur.' }
          ]
        }
      ]
    };

    const electricoTeamData = { name: 'Responsable Eléctrico', role: 'Gerente Eléctrico', funciones: 'Responsable del área de mantenimiento eléctrico.', children: [{ name: 'Coordinador Eléctrico 1', role: 'Coordinador de Mantenimiento', funciones: 'Supervisa zona Norte y CABA.' }, { name: 'Coordinador Eléctrico 2', role: 'Coordinador de Mantenimiento', funciones: 'Supervisa zona Sur y Oeste.' }] };
    const frioTeamData = { name: 'Responsable Frío', role: 'Gerente Frío', funciones: 'Responsable del área de frío alimentario y climatización.', children: [{ name: 'Auditor Frío 1', role: 'Auditor Técnico', funciones: 'Audita y valida trabalhos em zona Norte.' }, { name: 'Auditor Frío 2', role: 'Auditor Técnico', funciones: 'Audita y valida trabalhos em zona Sur.' }] };
    const ssggTeamData = { name: 'Responsable SSGG', role: 'Gerente SSGG', funciones: 'Responsable de Servicios Generales.', children: [{ name: 'Supervisor Limpieza', role: 'Supervisor', funciones: 'Gestiona proveedores de limpieza.' }, { name: 'Supervisor Seguridad', role: 'Supervisor', funciones: 'Gestiona proveedores de cerrajería, alarmas, etc.' }] };
    const tecnicosTeamData = { name: 'Pato', role: 'Lider de tecnicos', children: [{ name: 'Gabriel Velazco', role: 'Coord. Técnicos internos', funciones: 'Coordinación de cuadrilla de técnicos. Administrar los recursos y herramientas. Supervisar y reportar avances.', children: [{ name: 'Equipo Interior', role: '5 técnicos, 5 Camionetas', funciones: 'Tareas de técnicos' }, { name: 'Equipo Jonathan Fernandez', role: 'Líder + 2, 3 Camionetas', funciones: 'Ejecutar el cronograma asignado a su equipo, Solicitud de pedido de insumos/herramientas, Control de flota' }, { name: 'Equipo Facundo Moriz', role: 'Líder + 2, 3 Camionetas', funciones: 'Ejecutar el cronograma asignado a su equipo, Solicitud de pedido de insumos/herramientas, Control de flota' }, { name: 'Equipo Cristian Muñoz', role: 'Líder + 3, 3 Camionetas', funciones: 'Ejecutar desvíos, Cerramientos por plagas, Solicitud de pedido de insumos/herramientas, Control de flota' }] }] };


    function createOrgChart(nodeData, container) {
      if (!container) return;
      container.innerHTML = '';

      const nodeWrapper = document.createElement('div');
      nodeWrapper.className = 'org-node-wrapper';

      const nodeElement = document.createElement('div');
      nodeElement.className = 'org-node';

      // Build funciones with LINE BREAKS (no bullets)
      let funcionesHTML = '';
      if (Array.isArray(nodeData.funciones)) {
        const items = nodeData.funciones.filter(Boolean).map(s => String(s).trim()).filter(s => s.length);
        if (items.length) {
          funcionesHTML = '<div class="funciones">' + items.map(it => `<div>${it}</div>`).join('') + '</div>';
        } else {
          funcionesHTML = '<div class="funciones"></div>';
        }
      } else if (nodeData.funciones) {
        const raw = String(nodeData.funciones);
        const pieces = raw.split(/(?:\r?\n|<br\s*\/?>|•)\s*/i)
          .map(s => s.replace(/^\s*[-–]\s*/, '').trim())
          .filter(Boolean);
        if (pieces.length) {
          funcionesHTML = '<div class="funciones">' + pieces.map(it => `<div>${it}</div>`).join('') + '</div>';
        } else {
          funcionesHTML = `<div class="funciones">${raw}</div>`;
        }
      } else {
        funcionesHTML = '<div class="funciones"></div>';
      }

      nodeElement.innerHTML = `<div class="name">${nodeData.name}</div><div class="role">${nodeData.role}</div>${funcionesHTML}`;
      nodeWrapper.appendChild(nodeElement);

      if (nodeData.children && nodeData.children.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'org-children';
        nodeData.children.forEach(child => {
          const childNode = createOrgChart(child, document.createElement('div'));
          childrenContainer.appendChild(childNode);
        });
        nodeWrapper.appendChild(childrenContainer);
      }

      container.appendChild(nodeWrapper);
      return nodeWrapper;
    }

    createOrgChart(civilTeamData, document.getElementById('civil-chart-container'));
    createOrgChart(electricoTeamData, document.getElementById('electrico-chart-container'));
    createOrgChart(frioTeamData, document.getElementById('frio-chart-container'));
    createOrgChart(ssggTeamData, document.getElementById('ssgg-chart-container'));
    createOrgChart(tecnicosTeamData, document.getElementById('tecnicos-chart-container'));

    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw2YMRm9vDpaaQOi0odPAMJFjEUjQCiXuS-S2foCGAbpUprZ0KT3i-sHKHJ0uDp0kg/exec';
    const PROVIDER_API_URL = 'https://script.google.com/macros/s/AKfycbxASDnN99KvUaIWQSRnyd7RuI1vH--PsRXZjah8lJTlytEBSdvtL8iSRdOiMEi0yEg/exec';
    const CRONOGRAMA_API_URL = 'https://script.google.com/macros/s/AKfycbykRTpfuTcKi_pBDiniW3ooaQerQQVuKCrLuxbIknPNLU3fw1ZYy70G0bAzK2YKe2uM/exec';

    let searchCount = parseInt(localStorage.getItem('searchCount_v1') || '0', 10);
    const counterDisplay = document.getElementById('search-counter-display');
    const updateCounterDisplay = () => { counterDisplay.textContent = searchCount; };
    updateCounterDisplay();

    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-button');
    const resultsContainer = document.getElementById('results-container');
    const initialMessage = document.getElementById('initial-message');
    const noResultsMessage = document.getElementById('no-results-message');
    const provinciaFilter = document.getElementById('provincia-filter');
    const localidadFilter = document.getElementById('localidad-filter');
    const filterButton = document.getElementById('filter-button');
    const resultsContainerZona = document.getElementById('results-container-zona');
    const initialMessageZona = document.getElementById('initial-message-zona');
    const noResultsMessageZona = document.getElementById('no-results-message-zona');

    let mainSheetData = [];
    let allProvidersData = [];
    let providersLoaded = false;
    let cronogramaData = [];
    let cronogramaLoaded = false;

    // DAVOO: Nueva función experta para formatear fechas.
    function formatDate(dateString) {
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        // Verificamos si la fecha es válida
        if (isNaN(date)) return '-';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es 0-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
      } catch (error) {
        console.error("Error al formatear la fecha:", error);
        return '-'; // Devolvemos un valor por defecto en caso de error
      }
    }

    // --- LÓGICA DE CARGA DE DATOS PRINCIPAL ---
    fetch(GOOGLE_SHEET_URL)
      .then(response => { if (!response.ok) throw new Error(`Error de red: ${response.statusText}`); return response.json(); })
      .then(data => {
        mainSheetData = data;
        initialMessage.textContent = 'Ingresa un término de búsqueda y presiona Enter para ver los resultados.';
        searchInput.disabled = false;
        setupSearch(mainSheetData);
        populateFilters(mainSheetData);
        setupFilterLogic(mainSheetData);
      })
      .catch(error => { console.error('Error al cargar los datos de Google Sheets:', error); resultsContainer.innerHTML = `<p class="text-center text-red-500 font-semibold">Error: No se pudieron cargar los datos.</p>`; resultsContainerZona.innerHTML = `<p class="text-center text-red-500 font-semibold">Error: No se pudieron cargar los datos.</p>`; });

    // --- LÓGICA DEL PANEL DE CONSULTA PRINCIPAL ---
    function setupSearch(sheetData) { searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const searchTerm = searchInput.value.trim().toLowerCase(); if (searchTerm.length === 0) return; searchCount++; localStorage.setItem('searchCount_v1', searchCount); updateCounterDisplay(); const filteredData = sheetData.map(row => ({ ...row })).filter(row => { const isNumericSearch = /^\d+$/.test(searchTerm); if (isNumericSearch) { return String(row.Tienda).toLowerCase() === searchTerm; } else { return Object.values(row).some(value => String(value).toLowerCase().includes(searchTerm)); } }); displayResults(filteredData, resultsContainer, initialMessage, noResultsMessage, searchInput.value); } }); searchInput.addEventListener('input', () => clearButton.classList.toggle('hidden', searchInput.value.length === 0)); clearButton.addEventListener('click', () => { searchInput.value = ''; displayResults([], resultsContainer, initialMessage, noResultsMessage, searchInput.value); searchInput.focus(); }); }
    function populateFilters(data) {
      try {
        // Normalizamos y construimos listas únicas
        const provincias = Array.from(new Set(
          data.map(r => String(r.Provincia || '').trim()).filter(Boolean)
        )).sort((a, b) => a.localeCompare(b, 'es'));

        const localidadesByProv = {};
        data.forEach(r => {
          const p = String(r.Provincia || '').trim();
          const l = String(r.Localidad || '').trim();
          if (!p || !l) return;
          if (!localidadesByProv[p]) localidadesByProv[p] = new Set();
          localidadesByProv[p].add(l);
        });

        // Pintamos selects
        provinciaFilter.innerHTML = '<option value=\"\">Todas</option>' +
          provincias.map(p => `<option value="${p}">${p}</option>`).join('');

        // Localidades inicial: todas
        const allLocs = Array.from(new Set(
          data.map(r => String(r.Localidad || '').trim()).filter(Boolean)
        )).sort((a, b) => a.localeCompare(b, 'es'));
        localidadFilter.innerHTML = '<option value=\"\">Todas</option>' +
          allLocs.map(l => `<option value="${l}">${l}</option>`).join('');

        // Guardamos en ventana para reuso
        window.__zoneData = data;
        window.__localidadesByProv = localidadesByProv;

        // Encadenado: al cambiar provincia, recalcular localidades
        provinciaFilter.addEventListener('change', () => {
          const p = provinciaFilter.value;
          let locs = [];
          if (p && localidadesByProv[p]) {
            locs = Array.from(localidadesByProv[p]);
          } else {
            locs = allLocs.slice();
          }
          locs.sort((a, b) => a.localeCompare(b, 'es'));
          localidadFilter.innerHTML = '<option value=\"\">Todas</option>' +
            locs.map(l => `<option value="${l}">${l}</option>`).join('');
          applyZoneFilters();
        });

        // Al cambiar localidad, aplicar inmediatamente
        localidadFilter.addEventListener('change', applyZoneFilters);

        // Aplicar filtros con botón si existe
        if (typeof filterButton !== 'undefined' && filterButton) {
          filterButton.addEventListener('click', applyZoneFilters);
        }

        // Iniciar sin resultados (evita render pesado)
        displayZoneResults([]);
      } catch (e) {
        console.error('populateFilters error:', e);
      }
    }

    // Función global para aplicar filtros de Zona
    function applyZoneFilters() {
      try {
        const p = (provinciaFilter && provinciaFilter.value) || '';
        const l = (localidadFilter && localidadFilter.value) || '';
        const data = window.__zoneData || [];

        const filtered = data.filter(row => {
          const matchP = !p || String(row.Provincia || '').trim() === p;
          const matchL = !l || String(row.Localidad || '').trim() === l;
          return matchP && matchL;
        });
        displayZoneResults(filtered);
      } catch (e) {
        console.error('applyZoneFilters error:', e);
      }
    } function setupFilterLogic(sheetData) {
      // Conservamos el click del botón, pero ya aplicamos también onChange en populateFilters()
      if (!filterButton) return;
      filterButton.addEventListener('click', () => {
        applyZoneFilters();
      });
    }

    // --- LÓGICA DEL PANEL DE PROVEEDORES ---
    function loadProviderData() {
      const providerInitialMessage = document.getElementById('provider-initial-message');
      providerInitialMessage.textContent = 'Cargando datos de proveedores...';

      fetch(PROVIDER_API_URL)
        .then(response => { if (!response.ok) throw new Error(`Error de red: ${response.statusText}`); return response.json(); })
        .then(data => {
          allProvidersData = data;
          providersLoaded = true;
          providerInitialMessage.classList.add('hidden');
          populateProviderFilters();
          displayProviders(allProvidersData);
          setupProviderFilterLogic();
        })
        .catch(error => {
          console.error('Error al cargar los datos de proveedores:', error);
          providerInitialMessage.innerHTML = `<p class="text-center text-red-500 font-semibold">Error: No se pudieron cargar los datos de proveedores.</p>`;
        });
    }
    function populateProviderFilters() {
      const rubroFilter = document.getElementById('rubro-filter-prov');
      const proveedorFilter = document.getElementById('proveedor-filter-prov');
      const rubros = [...new Set(allProvidersData.map(p => p.Rubro).filter(Boolean))].sort();
      const proveedores = [...new Set(allProvidersData.map(p => p.Proveedor).filter(Boolean))].sort();

      rubros.forEach(r => rubroFilter.appendChild(new Option(r, r)));
      proveedores.forEach(p => proveedorFilter.appendChild(new Option(p, p)));
    }
    function setupProviderFilterLogic() {
      const filterButtonProv = document.getElementById('filter-button-prov');
      const rubroFilter = document.getElementById('rubro-filter-prov');
      const proveedorFilter = document.getElementById('proveedor-filter-prov');

      filterButtonProv.addEventListener('click', () => {
        const selectedRubro = rubroFilter.value;
        const selectedProveedor = proveedorFilter.value;

        const filteredData = allProvidersData.filter(provider => {
          const matchRubro = !selectedRubro || provider.Rubro === selectedRubro;
          const matchProveedor = !selectedProveedor || provider.Proveedor === selectedProveedor;
          return matchRubro && matchProveedor;
        });
        displayProviders(filteredData);
      });
    }
    function displayProviders(providers) {
      const providerTableBody = document.getElementById('provider-table-body');
      const noProviderResults = document.getElementById('no-provider-results');
      const providerInitialMessage = document.getElementById('provider-initial-message');

      providerTableBody.innerHTML = '';
      providerInitialMessage.classList.add('hidden');
      noProviderResults.classList.toggle('hidden', providers.length > 0);

      providers.forEach(p => {
        const row = document.createElement('tr');
        row.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
        const mailLink = p.Mail ? `<a href="mailto:${p.Mail}" class="contact-link">${p.Mail}</a>` : '';
        const contactLink = p.Contacto ? `<a href="https://wa.me/${String(p.Contacto).replace(/\D/g, '')}" target="_blank" class="contact-link">${p.Contacto}</a>` : '';
        row.innerHTML = `<td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${p.Proveedor || ''}</td><td class="px-6 py-4">${p.Nombre || ''}</td><td class="px-6 py-4">${mailLink}</td><td class="px-6 py-4">${contactLink}</td><td class="px-6 py-4">${p.Rubro || ''}</td>`;
        providerTableBody.appendChild(row);
      });
    }

    // --- LÓGICA DEL PANEL DE PROVEEDORES POR ZONA ---
    function displayZoneResults(data) { resultsContainerZona.innerHTML = ''; initialMessageZona.classList.add('hidden'); noResultsMessageZona.classList.toggle('hidden', data.length > 0); if (data.length === 0) return; data.forEach(row => { const card = document.createElement('div'); card.className = 'result-card bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden'; const tienda = row['Tienda'] || 'N/A'; const fullAddress = [row['Direccion'] || '', row['Localidad'] || '', row['Provincia'] || ''].filter(Boolean).join(', '); const mapsLink = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`; const crearFilaDetalle = (etiqueta, valor) => !valor || valor === '-' || String(valor).trim() === '' ? '' : `<div class="py-1"><p class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">${etiqueta}</p><p>${valor}</p></div>`; const crearPanelEstatico = (titulo, icono, contenidoHTML) => !contenidoHTML || contenidoHTML.trim() === '' ? '' : `<div class="border dark:border-gray-700 mb-3 overflow-hidden shadow-sm rounded-lg"><div class="p-3 font-semibold flex items-center bg-gray-50 dark:bg-gray-700/[.5]"><span class="mr-3 text-xl">${icono}</span>${titulo}</div><div class="p-4 bg-white dark:bg-gray-800 text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">${contenidoHTML}</div></div>`; const contenidoCivil = crearFilaDetalle('Proveedor', row['Civil']); const contenidoFrio = crearFilaDetalle('Proveedor', row['Frio']); const contenidoElectricidad = crearFilaDetalle('Proveedor', row['Electrico']); const contenidoSSGG = Object.keys(row).filter(key => key.startsWith('SSGG') && row[key] && row[key] !== '-').map(key => crearFilaDetalle(key.replace('SSGG ', ''), row[key])).join(''); const panelCivilHtml = crearPanelEstatico('Civil/Obras', '🔧', contenidoCivil); const panelFrioHtml = crearPanelEstatico('Frio Alimentario', '❄️', contenidoFrio); const panelElectricidadHtml = crearPanelEstatico('Electricidad', '⚡️', contenidoElectricidad); const panelServiciosHtml = crearPanelEstatico('Servicios Generales', '🛒', contenidoSSGG); card.innerHTML = `<div class="p-4 bg-gray-50 dark:bg-gray-700/[.5] border-b border-gray-200 dark:border-gray-700"><div class="flex flex-wrap justify-between items-center gap-2"><div><p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Tienda</p><p class="text-2xl font-bold text-red-600 dark:text-red-500">${tienda}</p></div><div class="text-right"><p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Dirección</p><a href="${mapsLink}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium hover:text-red-600 dark:hover:text-red-500 hover:underline">${fullAddress || 'No especificada'}</a></div></div></div><div class="px-4 py-2 space-y-2">${panelCivilHtml}${panelFrioHtml}${panelElectricidadHtml}${panelServiciosHtml}${panelEquipamientoHtml}</div>`; resultsContainerZona.appendChild(card); }); }

    // --- FUNCIÓN DE DISPLAY PRINCIPAL ---
    function displayResults(data, container, initialMsgEl, noResultsMsgEl, searchTermValue) {
      container.innerHTML = '';
      initialMsgEl.classList.add('hidden');
      noResultsMsgEl.classList.add('hidden');
      if (data.length === 0) { if (searchTermValue && searchTermValue.trim().length > 0) { noResultsMsgEl.classList.remove('hidden'); } else { initialMsgEl.classList.remove('hidden'); } return; }
      data.forEach(row => {
        const card = document.createElement('div');
        card.className = 'result-card bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden';
        const keysMostradas = ['Tienda', 'Direccion', 'Localidad', 'Provincia', 'Gerente de ventas', 'Gerente de ventas contacto', 'Gerente Regional', 'Gerente regional contacto', 'Franquiciado', 'Franquiciado contacto', 'Gestión', 'Zona', 'Formato', 'Tecnicos internos', 'Zona tecnicos', 'EMail', 'HORARIO LUNES A SABADO', 'HORARIO DOMINGO', 'Sindicato', 'SUPERVISOR PP', 'SUPERVISOR PP CONTACTO', 'Estado', 'Operaciones', 'CECO', 'CP', 'Tipo de socio', 'Supervisor ventas', 'Numero supervisor ventas', 'Coordenadas'];
        const tienda = row['Tienda'] || 'N/A';
        const direccion = row['Direccion'] || '';
        const localidad = row['Localidad'] || '';
        const provincia = row['Provincia'] || '';
        const estado = row['Estado'] || '-';
        const gerenteVentas = row['Gerente de ventas'] || '-';
        const contactoGv = row['Gerente de ventas contacto'] || '-';
        const regional = row['Gerente Regional'] || '-';
        const contactoReg = row['Gerente regional contacto'] || '-';
        const gestion = row['Gestión'] || '-';
        const franquiciado = row['Franquiciado'] || '-';
        const contactoFranquiciado = row['Franquiciado contacto'] || '-';
        const supervisorPP = row['SUPERVISOR PP'] || '-';
        const supervisorPPContacto = row['SUPERVISOR PP CONTACTO'] || '-';
        const supervisorVentas = row['Supervisor ventas'] || '-';
        const numeroSupervisorVentas = row['Numero supervisor ventas'] || '-';
        const zona = row['Zona'] || '-';
        const formato = row['Formato'] || '-';
        const tecnicos = row['Tecnicos internos'] || '-';
        const zonaTec = row['Zona tecnicos'] || '-';
        const email = row['EMail'] || '-';
        const horarioLuSa = row['HORARIO LUNES A SABADO'] || '-';
        const horarioDo = row['HORARIO DOMINGO'] || '-';
        const sindicato = row['Sindicato'] || '-';
        const operaciones = row['Operaciones'] || '-';
        const tipoDeSocio = row['Tipo de socio'] || '-';
        const ceco = row['CECO'] || '-';
        const cp = row['CP'] || '-';
        const share = row['SHARE'] || '';
        delete row['SHARE'];
        delete row['Share'];
        delete row['share'];
        const fullAddress = [direccion, localidad, provincia].filter(Boolean).join(', ');
        let mapsLink = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;
        if (share && share.includes(',')) { const coords = share.split(',').map(c => c.trim()); mapsLink = `https://www.google.com/maps?q=${coords[0]},${coords[1]}`; }
        const crearLinkWhatsApp = (textoContacto) => !textoContacto || textoContacto === '-' ? `(${textoContacto})` : `(<a href="https://wa.me/${String(textoContacto).replace(/\D/g, '')}" target="_blank" class="contact-link">${textoContacto}</a>)`;
        const linkContactoGv = crearLinkWhatsApp(contactoGv);
        const linkContactoReg = crearLinkWhatsApp(contactoReg);
        const linkContactoFranq = crearLinkWhatsApp(contactoFranquiciado);
        const linkSupervisorPP = crearLinkWhatsApp(supervisorPPContacto);
        const linkSupervisorVentas = crearLinkWhatsApp(numeroSupervisorVentas);
        const generarHtmlEstado = (status) => { const norm = String(status).toUpperCase().trim(); switch (norm) { case 'ABIERTO': return `<div class="status-pulse"><strong class="font-semibold">Estado:</strong> <span class="text-green-500 font-bold">😊 ${status}</span></div>`; case 'CERRADA': return `<div><strong class="font-semibold">Estado:</strong> <span class="text-orange-500 font-bold">😞 ${status}</span></div>`; case '#N/A': case 'CIERRE DEFINITIVO': return `<div><strong class="font-semibold">Estado:</strong> <span class="text-gray-600 dark:text-gray-400 font-bold">😢 ${status}</span></div>`; default: return `<strong>Estado:</strong> ${status}`; } };
        const estadoHtml = generarHtmlEstado(estado);
        const crearFilaDetalle = (etiqueta, valor) => !valor || valor === '-' || String(valor).trim() === '' ? '' : `<div class="py-1"><p class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">${etiqueta}</p><p>${valor}</p></div>`;
        const crearPanelEstatico = (titulo, icono, contenidoHTML) => !contenidoHTML || contenidoHTML.trim() === '' ? '' : `<div class="border dark:border-gray-700 mb-3 overflow-hidden shadow-sm rounded-lg"><div class="p-3 font-semibold flex items-center bg-gray-50 dark:bg-gray-700/[.5]"><span class="mr-3 text-xl">${icono}</span>${titulo}</div><div class="p-4 bg-white dark:bg-gray-800 text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">${contenidoHTML}</div></div>`;
        const keysCivil = ['Civil', 'Civil Proveedor Plan cubiertas', 'Civil Tipo Plan Cubiertas', 'Coordinador Plan Cubiertas', 'Ticket del plan Cubiertas'];
        const keysFrio = ['Frio', 'Aire A. Frio', 'Auditor Frio'];
        const keysElectricidad = ['Empresa energetica', 'Empresa energetica Cliente', 'Pase de Losa', 'Electrico', 'Electrico Suplente', 'Electrico Suplente 3', 'GE. Propio', 'GE'];
        const keysEquipamiento = ['SSGG Zorra Electricas', 'SSGG Serial de las Zorras Electricas', 'SSGG Maquina Limp', 'SSGG Serial Maquina Limp', 'SSGG Balanza', 'SSGG SERIE1', 'SSGG SERIE2', 'SSGG SERIE3', 'SSGG SERIE4', 'SSGG SERIE5', 'SSGG SERIE6', 'SSGG SERIE7', 'SSGG SERIE8', 'SSGG Bascula', 'SSGG Zorras Manuales']; // <-- AÑADIR ESTA LÍNEA EQUIPAMIENTO NUEVA
        const contenidoCivil = keysCivil.map(k => crearFilaDetalle(k.replace('Civil ', ''), row[k])).join('');
        const contenidoFrio = keysFrio.map(k => crearFilaDetalle(k, row[k])).join('');
        const contenidoElectricidad = keysElectricidad.map(k => crearFilaDetalle(k, row[k])).join('');
        const contenidoServicios = Object.keys(row).filter(key => key.startsWith('SSGG') && row[key] && row[key] !== '-' && !keysEquipamiento.includes(key)).map(key => crearFilaDetalle(key.replace('SSGG ', ''), row[key])).join('');
        const contenidoEquipamiento = keysEquipamiento.map(k => crearFilaDetalle(k.replace('SSGG ', ''), row[k])).join(''); // <-- ESTA ES LA LÍNEA QUE DEBES AÑADIR
        const panelCivilHtml = crearPanelEstatico('Civil/Obras', '🔧', contenidoCivil);
        const panelFrioHtml = crearPanelEstatico('Frio Alimentario', '❄️', contenidoFrio);
        const panelElectricidadHtml = crearPanelEstatico('Electricidad', '⚡️', contenidoElectricidad);
        const panelServiciosHtml = crearPanelEstatico('Servicios Generales', '🛒', contenidoServicios);
        const panelEquipamientoHtml = crearPanelEstatico('Equipamiento', '📦', contenidoEquipamiento); // <-- AÑADIR ESTA LÍNEA 
        let otrosDetallesHtml = '';
        const allShownKeys = new Set([...keysMostradas, ...keysCivil, ...keysFrio, ...keysElectricidad, ...Object.keys(row).filter(k => k.startsWith('SSGG'))]);
        for (const key in row) if (row[key] && row[key] !== '-' && !allShownKeys.has(key)) otrosDetallesHtml += crearFilaDetalle(key, row[key]);
        const otrosDetallesPanel = crearPanelEstatico('Otros Datos', '📄', otrosDetallesHtml);
        card.innerHTML = `
                    <div class="p-4 bg-gray-50 dark:bg-gray-700/[.5] border-b border-gray-200 dark:border-gray-700">
                        <div class="flex flex-wrap justify-between items-center gap-2">
                            <div><p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Tienda</p><p class="text-2xl font-bold text-red-600 dark:text-red-500">${tienda}</p></div>
                            <div class="text-right"><p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Dirección</p><div class="flex items-center justify-end"><a href="${mapsLink}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium hover:text-red-600 dark:hover:text-red-500 hover:underline">${fullAddress || 'No especificada'}</a><a href="${mapsLink}" target="_blank" rel="noopener noreferrer" class="ml-2 text-xl hover:text-red-600" title="Ver en Google Maps">🗺️</a></div></div>
                        </div>
                    </div>
                    <div class="p-4"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                        <div class="flex items-start"><span class="text-lg mr-2">👤</span><div><strong class="font-semibold">Gerente Ventas:</strong> ${gerenteVentas} ${linkContactoGv}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">👤</span><div><strong class="font-semibold">Gerente Regional:</strong> ${regional} ${linkContactoReg}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">👤</span><div><strong class="font-semibold">Franquiciado:</strong> ${franquiciado} ${linkContactoFranq}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">👤</span><div><strong class="font-semibold">Supervisor PP:</strong> ${supervisorPP} ${linkSupervisorPP}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">👤</span><div><strong class="font-semibold">Supervisor Ventas:</strong> ${supervisorVentas} ${linkSupervisorVentas}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">🏷️</span><div><strong class="font-semibold">Gestión:</strong> ${gestion}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">🏷️</span><div><strong class="font-semibold">Tipo de socio:</strong> ${tipoDeSocio} </div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">🚦</span>${estadoHtml}</div>
                        <div class="flex items-start"><span class="text-lg mr-2">🗺️</span><div><strong class="font-semibold">Zona:</strong> ${zona}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">📫</span><div><strong class="font-semibold">CP:</strong> ${cp}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">🏢</span><div><strong class="font-semibold">Formato:</strong> ${formato}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">⚙️</span><div><strong class="font-semibold">Operaciones:</strong> ${operaciones}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">#️⃣</span><div><strong class="font-semibold">CECO:</strong> ${ceco}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">🛠️</span><div><strong class="font-semibold">Técnicos:</strong> ${tecnicos}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">🛠️</span><div><strong class="font-semibold">Zona Téc:</strong> ${zonaTec}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">📧</span><div><strong class="font-semibold">Email:</strong> ${email}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">🕒</span><div><strong class="font-semibold">Horario Lun-Sáb:</strong> ${horarioLuSa}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">🕒</span><div><strong class="font-semibold">Horario Dom:</strong> ${horarioDo}</div></div>
                        <div class="flex items-start"><span class="text-lg mr-2">🏛️</span><div><strong class="font-semibold">Sindicato:</strong> ${sindicato}</div></div>
                    </div></div>
                    <div class="px-4 pb-4 space-y-2">${panelServiciosHtml}${panelCivilHtml}${panelFrioHtml}${panelElectricidadHtml}${panelEquipamientoHtml}${otrosDetallesPanel}</div>`;
        container.appendChild(card);
      });
    }

    // --- LÓGICA DEL PANEL DE HORARIOS ---
    function highlightCurrentAgent() {
      const agents = [
        // Usamos el mismo arreglo ya definido más arriba en el archivo si existe.
      ];
      // Obtener hora de Buenos Aires (evita desfases por zona horaria del usuario)
      const nowBA = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
      const dayOfWeek = (nowBA.getDay() + 6) % 7; // Lunes=0 ... Domingo=6
      const currentMinutes = nowBA.getHours() * 60 + nowBA.getMinutes();

      // Detectar si hay un arreglo agents ya declarado arriba y usarlo.
      try {
        if (window.__agentsSchedule && Array.isArray(window.__agentsSchedule)) {
          agents.splice(0, agents.length, ...window.__agentsSchedule);
        } else {
          // retrocompatibilidad: intentar leer el array que está dentro de esta función
          // (si quedó embebido por compatibilidad lo tomamos del closure original)
          if (typeof window.__extractAgents === 'function') {
            const extracted = window.__extractAgents();
            if (Array.isArray(extracted) && extracted.length) {
              agents.splice(0, agents.length, ...extracted);
            }
          }
        }
      } catch (e) { }

      agents.forEach(agent => {
        const shift = agent.schedule && agent.schedule[dayOfWeek];
        if (!shift || /^\s*libre\s*$/i.test(shift)) return;

        // Parseo robusto: "HH a HHhs" (puede venir con 'hs' o no)
        const parts = shift.replace(/hs/gi, '').split(' a ').map(s => s.trim());
        if (parts.length !== 2) return;
        let startH = parseInt(parts[0], 10);
        let endH = parseInt(parts[1], 10);
        if (isNaN(startH) || isNaN(endH)) return;

        if (endH === 0) endH = 24; // 00hs => 24:00
        const startMin = startH * 60;
        const endMin = endH * 60;

        if (currentMinutes >= startMin && currentMinutes < endMin) {
          const card = document.getElementById(`agent-card-${agent.name}`);
          const badgeContainer = document.getElementById(`badge-${agent.name}`);
          if (card && badgeContainer) {
            card.classList.add('agent-on-duty');
            badgeContainer.innerHTML = '<span class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-200 dark:text-green-900">EN TURNO</span>';
          }
        }
      });
    }
    // Extrae dinámicamente los horarios desde la grilla semanal de cada tarjeta.
    // Devuelve un arreglo: [{ name: 'gabriela-dominguez', schedule: ['07 a 15hs', ...] }, ...]
    window.__extractAgents = function () {
      const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const dayIndex = (label) => {
        const d = norm(label);
        if (d.includes('lunes')) return 0;
        if (d.includes('martes')) return 1;
        if (d.includes('miercoles') || d.includes('miércoles')) return 2;
        if (d.includes('jueves')) return 3;
        if (d.includes('viernes')) return 4;
        if (d.includes('sabado') || d.includes('sábado')) return 5;
        if (d.includes('domingo')) return 6;
        return -1;
      };
      const agents = [];
      document.querySelectorAll('[id^="agent-card-"]').forEach(card => {
        const name = card.id.replace('agent-card-', '');
        const schedule = new Array(7).fill('Libre');
        const cells = card.querySelectorAll('.grid > div');
        cells.forEach(cell => {
          const ps = cell.querySelectorAll('p');
          if (ps.length >= 2) {
            const idx = dayIndex(ps[0].textContent.trim());
            const val = ps[1].textContent.trim();
            if (idx >= 0) schedule[idx] = val;
          }
        });
        agents.push({ name, schedule });
      });
      return agents;
    };
    highlightCurrentAgent();

    // --- LÓGICA PARA EL MÓDULO DE GUÍA DE DERIVACIÓN ---
    const teamData = [{ id: 1, name: 'Matias Alvarez', tasks: ['Fumigación por Roedores > Refuerzo'] }, { id: 2, name: 'Thiago Caride', tasks: ['Cartelería', 'Cintas', 'GE (Generador Eléctrico)', 'Matafuegos', 'Puertas automaticas'] }, { id: 3, name: 'Gabriela Dominguez', tasks: ['Balanzas / Básculas', 'Decomiso - Siniestros', 'Limpieza por cambio de gestión / pedido excepcional', 'Máquina de limpieza', 'Montacargas'] }, { id: 4, name: 'Lucas Figueroa', tasks: ['Cortinas', 'Zorras'] }, { id: 5, name: 'Jared Ramos', tasks: ['<strong>Cerrajería:</strong>', 'En capacitación', '-', '-', '<strong>-</strong>', '<strong>-</strong>'] }];
    const genericProcedureContent = `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>[Proveedor/Área]</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">[Categoría InvGate]</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Análisis Inicial:</strong> El agente debe solicitar a la tienda detalles específicos sobre el problema.</li><li><strong>Paso 2: Verificación Previa:</strong> Es obligatorio revisar el historial para descartar tickets duplicados o en proceso. <div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 3: Derivación:</strong> Derivar el caso al proveedor técnico o área interna correspondiente.</li></ul></div>`;
    const fumigacionProcedureContent = `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>SSGG</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mantenimiento de Tienda > Servicios Generales > Fumigación por Plagas otros > Refuerzo</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Verificación y Contacto:</strong> Es obligatorio revisar el historial para descartar tickets duplicados. Adicionalmente, se debe contactar a la tienda para solicitar más información (fotos/videos). <br><strong class="text-red-600">La tienda debe indicar mediante fotos o videos la necesidad; de lo contrario, se rechaza el ticket. Es responsabilidad del agente categorizar bien el ticket.</strong><div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 2: Derivación y Coordinación:</strong> Se debe contactar de inmediato al proveedor asignado para coordinar el servicio.</li><li><strong>Paso 3: Contingencia y Presupuesto:</strong> Si el proveedor asignado no puede asistir, se debe elevar la queja vía mail a <span class="font-mono text-sm bg-gray-100 p-1 rounded">serv.gen.mantenimiento@diagroup.com</span>. Si no puede prestar el servicio, se debe verificar con un proveedor "facility" solicitando un presupuesto. Seguir el <a href="https://daviddia2.github.io/Flujo-de-Gesti-n-de-Tickets/" target="_blank" class="text-red-600 underline">flujo administrativo SSGG</a>.</li><li><strong>Paso 4: Cierre:</strong> El proveedor informa la finalización adjuntando el remito en InvGate. El agente debe enviar la solicitud de solución a la tienda para su conformidad.</li></ul></div>`;
    const categoryProcedures = [{ name: 'Adecuación de cerradura caja fuerte', criticality: 'Critica', content: `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>SSGG</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mantenimiento de Tienda > Servicios Generales > Cerrajería > Apertura y cambio de cerradura caja fuerte</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Análisis Inicial:</strong> Contactar a la tienda de inmediato (vía llamada, WhatsApp o mail) para solicitar detalles específicos del problema (fotos/videos). La gestión debe tratarse con urgencia.</li><li><strong>Paso 2: Verificación Previa:</strong> Es obligatorio revisar el historial para descartar tickets duplicados o en proceso. <div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 3: Derivación y Coordinación:</strong> Se debe contactar de inmediato al <strong>Analista de Recaudación</strong> (vía grupo de WhatsApp) para consultar la próxima fecha de visita del camión de Brinks.</li><li><strong>Paso 4: Presupuesto y Planificación:</strong> Estos casos requieren visita planificada y presupuesto. Una vez obtenido y aprobado el presupuesto, se coordina con el cerrajero externo para que realice la labor. Seguir el <a href="https://daviddia2.github.io/Flujo-de-Gesti-n-de-Tickets/" target="_blank" class="text-red-600 underline">flujo administrativo SSGG</a>.</li><li><strong>Paso 5: Cierre:</strong> El proveedor informa la finalización adjuntando el remito en InvGate. El agente debe enviar la solicitud de solución a la tienda para su conformidad.</li></ul></div>` }, { name: 'Adecuación Matafuegos', criticality: 'Baja', content: genericProcedureContent }, { name: 'Adecuación Montacargas Mal Uso', criticality: 'Baja', content: `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>SSGG</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mantenimiento de Tienda > Servicios Generales > Adecuación Montacargas Mal Uso</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Verificación y Contacto:</strong> Es obligatorio revisar el historial para descartar tickets duplicados. Adicionalmente, se debe contactar a la tienda para solicitar más información (fotos/videos). <br><strong class="text-red-600">La tienda nunca indicará que averió el equipo por mal uso; es responsabilidad del agente categorizar bien el ticket en función de la necesidad.</strong><div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 2: Derivación y Coordinación:</strong> Se debe contactar de inmediato al proveedor asignado para coordinar el servicio.</li><li><strong>Paso 3: Presupuesto y Planificación:</strong> En caso de que el proveedor solo realice una reparación provisoria, se requiere una visita planificada y un presupuesto formal para la solución definitiva. Se debe presionar al proveedor para obtener dicho presupuesto. Seguir el <a href="https://daviddia2.github.io/Flujo-de-Gesti-n-de-Tickets/" target="_blank" class="text-red-600 underline">flujo administrativo SSGG</a>.</li><li><strong>Paso 4: Cierre:</strong> El proveedor informa la finalización adjuntando el remito en InvGate. El agente debe enviar la solicitud de solución a la tienda para su conformidad.</li></ul></div>` }, { name: 'Análisis de agua / Certificado de fumigacion / Limpieza de tanques', criticality: 'Baja', content: genericProcedureContent }, { name: 'Apertura y cambio de cerradura caja chica', criticality: 'Urgente', content: `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>SSGG</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mantenimiento de Tienda > Servicios Generales > Cerrajería > Apertura y cambio de cerradura caja chica</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Análisis Inicial:</strong> Contactar a la tienda de inmediato (vía llamada, WhatsApp o mail) para solicitar detalles específicos del problema (fotos/videos). La gestión debe tratarse con urgencia.</li><li><strong>Paso 2: Verificación Previa:</strong> Es obligatorio revisar el historial para descartar tickets duplicados o en proceso. <div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 3: Presupuesto y Planificación:</strong> Estos casos requieren visita planificada y presupuesto. Una vez obtenido y aprobado el presupuesto, se coordina con el cerrajero externo para que realice la labor. Seguir el <a href="https://daviddia2.github.io/Flujo-de-Gesti-n-de-Tickets/" target="_blank" class="text-red-600 underline">flujo administrativo SSGG</a>.</li><li><strong>Paso 4: Cierre:</strong> El proveedor informa la finalización adjuntando el remito en InvGate. El agente debe enviar la solicitud de solución a la tienda para su conformidad.</li></ul></div>` }, { name: 'Arcos de seguridad', criticality: 'Critica', content: `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>FENIX</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mant. tiendas Elect./Frio/Civil/Actas</span>.</p><ul class="mt-4 space-y-3"><li><strong>Responsabilidad Dividida:</strong> La instalación inicial es gestionada por <strong>Control de Pérdidas</strong>. Sin embargo, si el punto de conexión eléctrica (TOMA) no es adecuado, la adecuación de dicho toma corresponde a <strong>Mantenimiento</strong>.</li><li><strong>Verificación de Duplicados:</strong> Antes de proceder, es obligatorio revisar que el caso no esté duplicado. <div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Acciones en el Ticket:</strong> Se debe editar el ticket para completar toda la información al 100% y luego derivarlo al proveedor externo (ELÉCTRICO) que corresponda según el informe nacional.</li><li><strong class="text-red-600">Requisito Indispensable:</strong> Es imperativo que el pedido original sea generado por la tienda a través de InvGate.</li></ul></div>` }, { name: 'Balanzas', criticality: 'Baja', content: genericProcedureContent }, { name: 'Cambio de Cerradura de tienda', criticality: 'Baja', content: genericProcedureContent }, { name: 'Carteleria', criticality: 'Media', content: genericProcedureContent }, { name: 'CDG', criticality: 'Critica', content: `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>SSGG</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mantenimiento de Tienda > Servicios Generales > Cerrajería > CDG</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Autorización y Creación de Ticket:</strong> Estos servicios requieren autorización previa del Gerente de Ventas. El gerente debe activar el servicio mediante un mail por urgencia. El agente debe crear el ticket en InvGate adjuntando dicho mail como constancia. <br><strong class="text-red-600">No se podrá avanzar con la gestión si no está adjunto el mail que respalda el servicio.</strong></li><li><strong>Paso 2: Verificación Previa:</strong> Es obligatorio revisar el historial para descartar tickets duplicados o en proceso. <div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 3: Derivación y Coordinación:</strong> Se debe contactar de inmediato al cerrajero asignado para coordinar el servicio.</li><li><strong>Paso 4: Cierre:</strong> El proveedor informa la finalización adjuntando el remito en InvGate. El agente debe enviar la solicitud de solución a la tienda para su conformidad.</li></ul></div>` }, { name: 'Cerradura trabada / Puerta de ingreso', criticality: 'Alta', content: genericProcedureContent }, { name: 'Cinta Checkout', criticality: 'Media', content: genericProcedureContent }, { name: 'Civil > Corte de Pasto', criticality: 'Baja', content: genericProcedureContent }, { name: 'Colocación Matafuegos', criticality: 'Baja', content: genericProcedureContent }, { name: 'Cortina Lateral', criticality: 'Media', content: genericProcedureContent }, { name: 'Cortina que impida la apertura o cierre', criticality: 'Critica', content: `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>SSGG</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mantenimiento de Tienda > Servicios Generales > Cerrajería > Reparación cortina que impida la apertura o cierre</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Verificación y Contacto:</strong> Es obligatorio revisar el historial para descartar tickets duplicados. Adicionalmente, se debe contactar a la tienda para solicitar más información (fotos/videos). <div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 2: Derivación y Coordinación:</strong> Se debe contactar de inmediato al cortinero asignado para coordinar el servicio.</li><li><strong>Paso 3: Presupuesto y Planificación:</strong> En caso de que el proveedor solo realice una reparación provisoria, se requiere una visita planificada y un presupuesto formal para la solución definitiva. Se debe presionar al proveedor para obtener dicho presupuesto. Seguir el <a href="https://daviddia2.github.io/Flujo-de-Gesti-n-de-Tickets/" target="_blank" class="text-red-600 underline">flujo administrativo SSGG</a>.</li><li><strong>Paso 4: Cierre:</strong> El proveedor informa la finalización adjuntando el remito en InvGate. El agente debe enviar la solicitud de solución a la tienda para su conformidad.</li></ul></div>` }, { name: 'Cortinas Mal Uso', criticality: 'Critica', content: `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>SSGG</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mantenimiento de Tienda > Servicios Generales > Cortinas Mal Uso</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Verificación y Contacto:</strong> Es obligatorio revisar el historial para descartar tickets duplicados. Adicionalmente, se debe contactar a la tienda para solicitar más información (fotos/videos). <br><strong class="text-red-600">La tienda nunca indicará que averió la cortina por mal uso; es responsabilidad del agente categorizar bien el ticket en función de la necesidad.</strong><div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 2: Derivación y Coordinación:</strong> Se debe contactar de inmediato al cortinero asignado para coordinar el servicio.</li><li><strong>Paso 3: Presupuesto y Planificación:</strong> En caso de que el proveedor solo realice una reparación provisoria, se requiere una visita planificada y un presupuesto formal para la solución definitiva. Se debe presionar al proveedor para obtener dicho presupuesto. Seguir el <a href="https://daviddia2.github.io/Flujo-de-Gesti-n-de-Tickets/" target="_blank" class="text-red-600 underline">flujo administrativo SSGG</a>.</li><li><strong>Paso 4: Cierre:</strong> El proveedor informa la finalización adjuntando el remito en InvGate. El agente debe enviar la solicitud de solución a la tienda para su conformidad.</li></ul></div>` }, { name: 'Decomiso - Siniestros', criticality: 'Critica', content: `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>SSGG</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mantenimiento de Tienda > Servicios Generales > Retiros de Mercadería - Siniestros</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Verificación y Contacto:</strong> Es obligatorio revisar el historial para descartar tickets duplicados. Adicionalmente, se debe contactar a la tienda para solicitar más información (fotos/videos). <br><strong class="text-red-600">No se avanzará con ningún pedido de retiro de decomiso por siniestro sin la autorización previa de Prevención de Pérdidas. El OK debe estar adjunto mediante un print de pantalla.</strong><div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 2: Derivación y Coordinación:</strong> Una vez obtenida la autorización y verificada la cantidad de vehículos necesarios, se gestiona con urgencia con el proveedor asignado para coordinar el servicio.</li><li><strong>Paso 3: Contingencia y Presupuesto:</strong> Si el proveedor asignado no puede cumplir, es responsabilidad del agente solicitar un presupuesto de urgencia a un proveedor "facility". En este caso, se requiere una visita planificada y presupuesto formal. Seguir el <a href="https://daviddia2.github.io/Flujo-de-Gesti-n-de-Tickets/" target="_blank" class="text-red-600 underline">flujo administrativo SSGG</a>.</li><li><strong>Paso 4: Cierre:</strong> El proveedor informa la finalización adjuntando el remito en InvGate. El agente debe enviar la solicitud de solución a la tienda para su conformidad.</li></ul></div>` }, { name: 'Equipamiento > Señalización de emergencia y otros', criticality: 'Baja', content: genericProcedureContent }, { name: 'Fumigación por Alacranes', criticality: 'Baja', content: fumigacionProcedureContent }, { name: 'Fumigación por Hormigas > Refuerzo', criticality: 'Baja', content: fumigacionProcedureContent }, { name: 'Fumigación por Palomas > Refuerzo', criticality: 'Baja', content: fumigacionProcedureContent }, { name: 'Fumigación por Plagas otros > Refuerzo', criticality: 'Baja', content: fumigacionProcedureContent }, { name: 'Fumigación por Roedores > Refuerzo', criticality: 'Alta', content: genericProcedureContent }, { name: 'Fumigación vencida', criticality: 'Critica', content: fumigacionProcedureContent }, { name: 'Fumigación/Desrratización', criticality: 'Alta', content: genericProcedureContent }, { name: 'GE (Generador Eléctrico)', criticality: 'Critica', content: genericProcedureContent }, { name: 'Limpieza > Limpieza por Apertura', criticality: 'Urgente', content: genericProcedureContent }, { name: 'Limpieza > Tienda', criticality: 'Urgente', content: genericProcedureContent }, { name: 'Máquina de limpieza', criticality: 'Baja', content: genericProcedureContent }, { name: 'Montacargas', criticality: 'Critica', content: `<div class="prose max-w-none"><p class="font-semibold">El circuito de esta gestión corresponde a <strong>SSGG</strong> y la categoría es <span class="bg-gray-100 px-2 py-1 rounded-md text-sm">Mantenimiento de Tienda > Servicios Generales > Montacargas</span>.</p><ul class="mt-4 space-y-3"><li><strong>Paso 1: Verificación y Contacto:</strong> Es obligatorio revisar el historial para descartar tickets duplicados. Adicionalmente, se debe contactar a la tienda para solicitar más información (fotos/videos). <div class="flex space-x-2 mt-2"><a href="https://lookerstudio.google.com/reporting/89136f12-7eb0-45d2-a752-40108bcb3150" target="_blank" class="text-red-600 underline">Revisar en Looker</a><a href="https://dia.cloud.invgate.net/user/profile/public/id/5372" target="_blank" class="text-red-600 underline">Ver perfil en InvGate</a></div></li><li><strong>Paso 2: Derivación y Coordinación:</strong> Se debe contactar de inmediato al proveedor asignado para coordinar el servicio. <br><strong class="text-red-600">Para el proveedor Excell: después de las 17hs, fines de semana y feriados, además del mail, se debe llamar a la guardia (NO ENVIAR WHATSAPP). Si Excell no puede prestar servicio, recurrir a un facility.</strong></li><li><strong>Paso 3: Presupuesto y Planificación:</strong> En caso de que el proveedor solo realice una reparación provisoria, se requiere una visita planificada y un presupuesto formal para la solución definitiva. Se debe presionar al proveedor para obtener dicho presupuesto. Seguir el <a href="https://daviddia2.github.io/Flujo-de-Gesti-n-de-Tickets/" target="_blank" class="text-red-600 underline">flujo administrativo SSGG</a>.</li><li><strong>Paso 4: Cierre:</strong> El proveedor informa la finalización adjuntando el remito en InvGate. El agente debe enviar la solicitud de solución a la tienda para su conformidad.</li></ul></div>` }, { name: 'Portaprecios', criticality: 'Baja', content: genericProcedureContent }, { name: 'Puertas Automaticas', criticality: 'Alta', content: genericProcedureContent }, { name: 'Red de Incendio > Hidrantes', criticality: 'Baja', content: genericProcedureContent }, { name: 'Red de Incendio > Sensores de Humos', criticality: 'Baja', content: genericProcedureContent }, { name: 'Retiro de Basura', criticality: 'Critica', content: genericProcedureContent }, { name: 'Vidrios Rajados', criticality: 'Critica', content: genericProcedureContent }];

    const panelGuia = document.getElementById('panel-guia');
    if (panelGuia) {
      const tabButtons = panelGuia.querySelectorAll('.tab-button');
      const tabContents = panelGuia.querySelectorAll('.tab-content');
      const collaboratorSelect = document.getElementById('collaborator-select');
      const resultCard = document.getElementById('result-card-guia');
      const resultInitial = document.getElementById('result-initial');
      const resultName = document.getElementById('result-name');
      const resultTasks = document.getElementById('result-tasks');
      const categoryList = document.getElementById('category-list');
      const categoryDetail = document.getElementById('category-detail');
      const categorySearch = document.getElementById('category-search');
      const criticalityOrder = { 'critica': 1, 'urgente': 2, 'alta': 3, 'media': 4, 'baja': 5 };

      function switchTab(tabId) { tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId)); tabContents.forEach(content => content.classList.toggle('active', content.id === tabId)); }
      tabButtons.forEach(button => { button.addEventListener('click', () => switchTab(button.dataset.tab)); });

      if (collaboratorSelect) {
        teamData.sort((a, b) => a.name.localeCompare(b.name)).forEach(member => { collaboratorSelect.appendChild(new Option(member.name, member.id)); });
        collaboratorSelect.addEventListener('change', (e) => { const selectedId = e.target.value; if (!selectedId) { resultCard.classList.remove('visible'); return; } const selectedMember = teamData.find(member => member.id == selectedId); if (selectedMember) { resultInitial.textContent = selectedMember.name.charAt(0); resultName.textContent = selectedMember.name; resultTasks.innerHTML = ''; selectedMember.tasks.forEach(task => { const li = document.createElement('li'); li.innerHTML = task.replace(/  -/g, '   -'); if (task.startsWith('<strong>')) { li.className = 'list-none ml-[-1rem] mt-2 font-bold text-gray-800 dark:text-gray-200'; } else { li.className = 'font-semibold text-gray-700 dark:text-gray-300'; } resultTasks.appendChild(li); }); resultCard.classList.add('visible'); } });
      }

      function getCriticalityDotColor(criticality) { const level = criticality.toLowerCase(); if (level === 'critica') return 'bg-red-600'; if (level === 'urgente') return 'bg-red-400'; if (level === 'alta') return 'bg-yellow-400'; if (level === 'media') return 'bg-green-500'; if (level === 'baja') return 'bg-green-300'; return 'bg-gray-400'; }
      function renderCategories(filter = '') { categoryList.innerHTML = ''; const filteredCategories = categoryProcedures.filter(cat => cat.name.toLowerCase().includes(filter.toLowerCase())); filteredCategories.sort((a, b) => { const orderA = criticalityOrder[a.criticality.toLowerCase()] || 99; const orderB = criticalityOrder[b.criticality.toLowerCase()] || 99; if (orderA !== orderB) { return orderA - orderB; } return a.name.localeCompare(b.name); }).forEach(cat => { const button = document.createElement('button'); button.dataset.categoryId = cat.name; button.className = 'category-item w-full text-left px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700 flex items-center'; const dot = document.createElement('div'); dot.className = `criticidad-dot ${getCriticalityDotColor(cat.criticality)}`; const text = document.createElement('span'); text.textContent = cat.name; button.appendChild(dot); button.appendChild(text); categoryList.appendChild(button); }); }
      if (categoryList && categoryDetail) {
        renderCategories();
        categoryList.addEventListener('click', (e) => { const button = e.target.closest('button.category-item'); if (button) { const categoryId = button.dataset.categoryId; const procedure = categoryProcedures.find(p => p.name === categoryId); document.querySelectorAll('.category-item').forEach(btn => btn.classList.remove('active')); button.classList.add('active'); if (procedure) { let content = procedure.content || genericProcedureContent.replace(/\[Categoría InvGate\]/g, `<span class="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-md text-sm">${procedure.name}</span>`); categoryDetail.innerHTML = `<div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md sticky top-6"><div class="flex items-center mb-4"><div class="criticidad-dot ${getCriticalityDotColor(procedure.criticality)}"></div><h3 class="text-2xl font-bold text-gray-900 dark:text-white">${procedure.name}</h3></div><div class="text-gray-600 dark:text-gray-300">${content}</div></div>`; } } });
        categorySearch.addEventListener('input', (e) => { renderCategories(e.target.value); });
        const firstCategoryButton = categoryList.querySelector('.category-item'); if (firstCategoryButton) { firstCategoryButton.click(); }
      }
      switchTab('presentacion');
    }

    // --- LÓGICA DEL PANEL DE CRONOGRAMA ---
    function loadCronogramaData() {
      if (cronogramaLoaded) return;

      const resultsContainer = document.getElementById('cronograma-results-container');
      resultsContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">Cargando cronograma de técnicos...</p>';

      fetch(CRONOGRAMA_API_URL)
        .then(response => {
          if (!response.ok) throw new Error(`Error de red al cargar el cronograma: ${response.statusText}`);
          return response.json();
        })
        .then(data => {
          cronogramaData = data;
          cronogramaLoaded = true;

          populateCronogramaFilters(cronogramaData);
          updateKPIs(cronogramaData);
          setupCronogramaFilters();

          resultsContainer.innerHTML = '<p id="cronograma-initial-message" class="text-center text-gray-500 dark:text-gray-400 py-8">Utiliza los filtros para buscar una cuadrilla o tienda.</p>';
        })
        .catch(error => {
          console.error('Error al cargar el cronograma:', error);
          resultsContainer.innerHTML = `<p class="text-center text-red-500 font-semibold">Error: No se pudo cargar el cronograma. Verifica la URL y los permisos del script.</p>`;
        });
    }

    function updateKPIs(data) {
      document.getElementById('kpi-total').textContent = data.length;
      const abiertas = data.filter(d => String(d.Estado).toUpperCase() === 'ABIERTO').length;
      const cerradas = data.filter(d => String(d.Estado).toUpperCase() === 'CERRADA').length;
      const definitivo = data.filter(d => String(d.Estado).toUpperCase().includes('CIERRE DEFINITIVO')).length;

      document.getElementById('kpi-abiertas').textContent = abiertas;
      document.getElementById('kpi-cerradas').textContent = cerradas;
      document.getElementById('kpi-definitivo').textContent = definitivo;
    }

    function populateCronogramaFilters(data) {
      const cuadrillaFilter = document.getElementById('cuadrilla-filter-cronograma');
      const tiposDeCuadrilla = [...new Set(data.map(item => item['Tipo de cuadrilla']).filter(Boolean))].sort();
      cuadrillaFilter.innerHTML = '<option value="">Todas las cuadrillas</option>';
      tiposDeCuadrilla.forEach(c => {
        cuadrillaFilter.appendChild(new Option(c, c));
      });
    }

    function setupCronogramaFilters() {
      const cuadrillaFilter = document.getElementById('cuadrilla-filter-cronograma');
      const tiendaSearch = document.getElementById('tienda-search-cronograma');

      const applyFilters = () => {
        const selectedCuadrilla = cuadrillaFilter.value;
        const searchTerm = tiendaSearch.value.trim().toLowerCase();

        if (!selectedCuadrilla && !searchTerm) {
          const container = document.getElementById('cronograma-results-container');
          container.innerHTML = '<p id="cronograma-initial-message" class="text-center text-gray-500 dark:text-gray-400 py-8">Utiliza los filtros para buscar una cuadrilla o tienda.</p>';
          return;
        }

        let filteredData = cronogramaData;

        if (selectedCuadrilla) {
          filteredData = filteredData.filter(d => d['Tipo de cuadrilla'] === selectedCuadrilla);
        }
        if (searchTerm) {
          filteredData = filteredData.filter(d => String(d.Tienda).toLowerCase() === searchTerm);
        }
        displayCronogramaResults(filteredData);
      };

      cuadrillaFilter.addEventListener('change', applyFilters);
      tiendaSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          applyFilters();
        }
      });
    }

    function displayCronogramaResults(data) {
      const container = document.getElementById('cronograma-results-container');
      container.innerHTML = '';

      if (data.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 py-8">No se encontraron tiendas para los filtros seleccionados.</p>';
        return;
      }

      data.forEach(cronogramaRow => {
        const storeInfo = mainSheetData.find(store => String(store.Tienda) === String(cronogramaRow.Tienda));

        const card = document.createElement('div');
        card.className = 'bg-gray-800 rounded-xl shadow-lg p-4 space-y-3';

        // DAVOO: Lógica de enlaces mejorada y centralizada
        let fullAddress = 'No especificada';
        let mapsLink = '#';
        let coordsLinkHTML = ''; // Esta variable contendrá el HTML completo del enlace de coordenadas

        if (storeInfo) {
          fullAddress = [storeInfo['Direccion'], storeInfo['Localidad'], storeInfo['Provincia']].filter(Boolean).join(', ');
          // Por defecto, el enlace del mapa busca la dirección por texto
          mapsLink = `http://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;

          const shareCoords = storeInfo['SHARE'];

          // Si existen coordenadas, las priorizamos porque son más exactas
          if (shareCoords && String(shareCoords).includes(',')) {
            // DAVOO: 1. LIMPIEZA DE DATOS - Tomamos solo los dos primeros valores (latitud, longitud)
            const parts = String(shareCoords).split(',');
            const sanitizedCoords = `${parts[0].trim()},${parts[1].trim()}`;

            // DAVOO: 2. URL PRECISA - Usamos el formato ?q=lat,long que es el más robusto
            const preciseUrl = `http://www.google.com/maps?q=${sanitizedCoords}`;

            mapsLink = preciseUrl; // La dirección ahora también apunta a la coordenada exacta
            coordsLinkHTML = `<a href="${preciseUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-red-500 underline">(Ver Coordenadas)</a>`;
          }
        } else {
          // Fallback si no encontramos info extra de la tienda
          fullAddress = cronogramaRow.Direccion || 'No especificada';
          mapsLink = `http://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;
        }

        const whatsappLink = cronogramaRow.Telefono ? `https://wa.me/${String(cronogramaRow.Telefono).replace(/\D/g, '')}` : '#';

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-medium text-gray-400">Tienda</p>
                    <p class="text-2xl font-bold text-red-500">${cronogramaRow.Tienda || 'N/A'}</p>
                </div>
                <div class="flex-shrink-0">
                    <button class="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors rounded-full text-gray-400" aria-label="Ocultar detalle">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="border-t border-gray-700 pt-3 space-y-2 text-sm">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-gray-300">
                    <div><strong class="font-semibold text-gray-200">Gerente Ventas:</strong> ${storeInfo ? storeInfo['Gerente de ventas'] || '-' : '-'}</div>
                    <div><strong class="font-semibold text-gray-200">Gerente Regional:</strong> ${storeInfo ? storeInfo['Gerente Regional'] || '-' : '-'}</div>
                    <div><strong class="font-semibold text-gray-200">Zona:</strong> ${storeInfo ? storeInfo['Zona'] || '-' : '-'}</div>
                    <div><strong class="font-semibold text-gray-200">Estado:</strong> ${storeInfo ? storeInfo['Estado'] || '-' : '-'}</div>
                </div>
                 <div class="flex flex-wrap items-center gap-x-4 text-gray-300">
                    <a href="${mapsLink}" target="_blank" rel="noopener noreferrer" class="hover:text-red-500 underline">📍 ${fullAddress}</a>
                    ${coordsLinkHTML}
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-gray-300">
                   <div><strong class="font-semibold text-gray-200">Gestión:</strong> ${storeInfo ? storeInfo['Gestión'] || '-' : '-'}</div>
                   <div><strong class="font-semibold text-gray-200">Formato:</strong> ${storeInfo ? storeInfo['Formato'] || '-' : '-'}</div>
                </div>
            </div>

            <div class="border-t border-gray-700 pt-3 space-y-2 text-sm">
                 <div class="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-gray-300">
                    <div><strong class="font-semibold text-gray-200">Tipo Cuadrilla:</strong> ${cronogramaRow['Tipo de cuadrilla'] || '-'}</div>
                    <div><strong class="font-semibold text-gray-200">Colaborador:</strong> ${cronogramaRow['Nombre del colaborador de la asistencia a tienda'] || '-'}</div>
                     <div>
                        <strong class="font-semibold text-gray-200">Teléfono:</strong> 
                        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="contact-link">${cronogramaRow.Telefono || '-'}</a>
                    </div>
                    <div><strong class="font-semibold text-gray-200">Fecha Asistencia:</strong> ${formatDate(cronogramaRow['Fecha Asistencia realizada'])}</div>
                    <div><strong class="font-semibold text-gray-200">Mes Visita:</strong> ${cronogramaRow['Mes visita a tienda'] || '-'}</div>
                    <div><strong class="font-semibold text-gray-200">Condición:</strong> ${cronogramaRow['Condicion mes visita'] || '-'}</div>
                </div>
            </div>
        `;
        container.appendChild(card);
      });
    }

  });
});
(function () {
  function initOrganigramaVF() {
    const root = document.querySelector('#panel-organigrama-vf .organigrama-vf');
    if (!root) return;
    if (root.dataset.vfInit === '1') { return; }
    root.dataset.vfInit = '1';
    const $ = (sel) => root.querySelector(sel);
    const $$ = (sel) => root.querySelectorAll(sel);

    const tabButtons = $$('.tab-button');
    const sections = $$('.tab-content');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sections.forEach(s => { s.classList.add('hidden'); s.style.display = 'none'; });
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetSel = btn.getAttribute('data-target');
        const section = root.querySelector(targetSel);
        if (section) { section.classList.remove('hidden'); section.style.display = 'block'; }
      });
    });

    const modal = $('#info-modal');
    const modalClose = $('#modal-close-btn');
    const modalTitle = $('#modal-title');
    const modalRole = $('#modal-role');
    const modalBody = $('#modal-body');
    function openModal(title, role, bodyHtml) {
      if (!modal) return;
      modalTitle.textContent = title || '';
      modalRole.textContent = role || '';
      modalBody.innerHTML = bodyHtml || '';
      modal.classList.add('active');
    }
    if (modalClose) modalClose.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    function createCardHTML(node, level) {
      const borderLevel = level > 3 ? 3 : level;
      return `
                <div class="card level-${borderLevel}" data-name="${node.name || ''}">
                    <div class="card-name">${node.name || ''}</div>
                    <div class="card-role">${node.role || ''}</div>
                </div>`;
    }
    function buildOrgList(node, level = 0) {
      const li = document.createElement('li');
      li.innerHTML = createCardHTML(node, level);
      const card = li.firstElementChild;
      card.addEventListener('click', () => {
        let body = '';
        if (node.funciones) body += `<p>${node.funciones}</p>`;
        if (node.managedTeamTitle) body += `<h4 class="font-semibold mt-3 mb-1">${node.managedTeamTitle}</h4>`;
        if (node.managedTeam && Array.isArray(node.managedTeam)) {
          body += '<ul class="list-disc pl-5">';
          node.managedTeam.forEach(m => { body += `<li><strong>${m.name}</strong> — ${m.role}. <span class='text-sm text-gray-600'>${m.funciones || ''}</span></li>`; });
          body += '</ul>';
        }
        openModal(node.name, node.role, body);
      });
      if (node.children && node.children.length) {
        const ul = document.createElement('ul');
        node.children.forEach(child => ul.appendChild(buildOrgList(child, level + 1)));
        li.appendChild(ul);
      }
      return li;
    }
    function renderOrgChart(containerSel, data) {
      const container = $(containerSel);
      if (!container) return;
      container.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'org-chart';
      const ul = document.createElement('ul');
      const li = buildOrgList(data, 0);
      ul.appendChild(li);
      wrapper.appendChild(ul);
      container.appendChild(wrapper);
    }
    const ssggTeamData = { name: 'Roberta Di Pace', role: 'Gerente SSGG', funciones: 'Responsable final del área de Servicios Generales, alineando los objetivos del sector con la estrategia de la compañía y asegurando la correcta ejecución presupuestaria.', children: [{ name: 'Juan Basini', role: 'Líder SSGG (Mantenimiento)', funciones: 'Presupuesto, Compras de servicios generales, Todo lo que requiere habilitación: red de incendio', managedTeamTitle: 'Equipo a Cargo (1)', managedTeam: [{ name: 'Matias Alvarez', role: 'Administrativo SSGG', funciones: 'Fumigación y Actas' }] }, { name: 'Patricio Varela', role: 'Líder SSGG (Mantenimiento)', funciones: 'Liderar el equipo de técnicos, Asignar roles y responsabilidades, Supervisar los avances de los objetivos, Impulsar el desarrollo profesional del equipo, Planificación de los planes de la compañía, Comunicación continua con cliente externo e interno', children: [{ name: 'Gabriel Velazco', role: 'Coord. Técnicos internos', funciones: 'Coordinación de cuadrilla de técnicos, Administrar los recursos y herramientas, Supervisar y reportar avances', managedTeamTitle: 'Equipos Técnicos a Cargo (18)', managedTeam: [{ name: 'Equipo Interior', role: '5 técnicos, 5 Camionetas', funciones: 'Tareas de técnicos' }, { name: 'Equipo Jonathan Fernandez', role: 'Referente + 2, 3 Camionetas', funciones: 'Ejecutar el cronograma asignado a su equipo, Solicitud de pedido de insumos/herramientas, Control de flota' }, { name: 'Equipo Facundo Moriz', role: 'Referente + 2, 3 Camionetas', funciones: 'Ejecutar el cronograma asignado a su equipo, Solicitud de pedido de insumos/herramientas, Control de flota' }, { name: 'Equipo Cristian Muñoz', role: 'Referente + 3, 3 Camionetas', funciones: 'Ejecutar desvíos, Cerramientos por plagas, Solicitud de pedido de insumos/herramientas, Control de flota' }] }, { name: 'Jonathan Ferro', role: 'Analista de Procesos y Administración', funciones: 'Encargado de la integración y transformación de datos desde Invgate y FENIX, con desarrollo de dashboards en Power BI y Looker Studio para distintos sectores. Automatización de reportes mediante macros, soporte técnico y gestión de herramientas digitales (FENIX, Invgate). Capacitación a usuarios, mantenimiento de bases de datos y ejecución de APIs para optimización de procesos.', }, { name: 'David Diaz', role: 'Analista de Procesos y Administración', funciones: 'Chatbot SSGG, Chatbot de técnicos, Procesos del contact center, Cronograma de técnicos, Proyecto nueva Carpeta verde digital, Gestión Presupuestaria, Administración, Control de Gastos en compras de insumo, Procesos Actas', }, { name: 'Natalia Gonzalez', role: ' Contact Center & Auditoría', funciones: 'Coordinación del contact, Limpieza de tiendas, Planning semanal de reapertura, Validación y auditar de correctivos y abonos', managedTeamTitle: 'Equipo a Cargo (4)', managedTeam: [{ name: 'Jared Ramos', role: 'Equipo Contact', funciones: 'En capacitación' }, { name: 'Lucas Figueroa', role: 'Equipo Contact', funciones: 'Generadores eléctricos, Recolección de residuos y decomisos, Balanzas, Básculas' }, { name: 'Gabriela Dominguez', role: 'Equipo Contact', funciones: 'Generadores eléctricos, Cerrajería, Cortinería, Cartelería' }, { name: 'Christian Andersch', role: 'Equipo Contact', funciones: 'Generadores eléctricos, Derivaciones a técnicos, Matafuegos, Reclamo por falta de remitos' }] }] }] };
    const civilTeamData = {
      name: 'Santiago Codesido',
      role: 'Gerente General de Civil',
      funciones: 'Diseñar y administrar el presupuesto del área, Controlar los presupuestos y proyectos de inversión correspondientes a la Red de Tiendas,Planificar los trabajos de mantenimiento y construcción de instalaciones y equipamiento de tiendas, nuevos proyectos como de cambios y mejoras, Implementar mejoras continuas e innovadoras con base en los resultados obtenidos en análisis comparativos, Coordinar y brindar soporte en las compras gestionadas con la herramienta ARIBA, Seleccionar proveedores de acuerdo con las necesidades de los proyectos,Coordinar con las distintas áreas de la Dirección de Operaciones los proyectos de la Compañía,Definir las políticas del rubro a nivel Compañía,Establecer planes de mejora en rubros específicos dentro del plan estratégico de mantenimiento de tiendas',
      children: [
        // Nicolas Grosso y todo su equipo ahora son "hijos" del nuevo Director.
        {
          name: 'Nicolas Grosso',
          role: 'Gerente Civil',
          funciones: 'Responsable del departamento de Obras y Proyectos Civiles.',
          children: [
            {
              name: 'Victoria Canepa',
              role: 'Líder de Equipamiento',
              funciones: 'Supervisa a los coordinadores de obras y proyectos asignados.',
              children: [
                { name: 'Leonardo Velazquez', role: 'Coordinador de equipamiento', funciones: 'Gestión y seguimiento de equipamiento en zona sur.' },
                { name: 'Carlos Romeo', role: 'Coordinador de equipamiento', funciones: 'Gestión y seguimiento de equipamiento en zona norte.' },
                { name: 'Kevin Paya', role: 'Analista de equipamiento', funciones: 'Análisis y reportería de estado de equipamiento.' }
              ]
            },
            { name: 'Martin Ingeniere', role: 'Coordinador de Obras', funciones: 'Coordinación de obras civiles en zona CABA.' },
            { name: 'Paula Cirillo', role: 'Coordinador de Obras', funciones: 'Coordinación de obras civiles en GBA Oeste.' },
            { name: 'Florencia Vargas', role: 'Coordinador de Obras', funciones: 'Coordinación de obras civiles en GBA Norte.' },
            { name: 'Matias Fadon', role: 'Coordinador de Obras', funciones: 'Coordinación de obras civiles en GBA Sur.' }
          ]
        }
      ]
    }; const frioTeamData = { name: 'Santiago Codesido', role: 'Gerente de Frío Alimentario', funciones: 'Diseñar y administrar el presupuesto del área, Controlar los presupuestos y proyectos de inversión correspondientes a la Red de Tiendas,Planificar los trabajos de mantenimiento y construcción de instalaciones y equipamiento de tiendas, nuevos proyectos como de cambios y mejoras, Implementar mejoras continuas e innovadoras con base en los resultados obtenidos en análisis comparativos, Coordinar y brindar soporte en las compras gestionadas con la herramienta ARIBA, Seleccionar proveedores de acuerdo con las necesidades de los proyectos,Coordinar con las distintas áreas de la Dirección de Operaciones los proyectos de la Compañía,Definir las políticas del rubro a nivel Compañía,Establecer planes de mejora en rubros específicos dentro del plan estratégico de mantenimiento de tiendas', children: [{ name: 'Gustavo Anselmino', role: 'Líder de Frío y Auditores', funciones: 'Liderar planificar coordinar y supervisar operaciones de mantenimiento preventivo correctivo y predictivo de sistemas de refrigeración y climatización como cámaras centrales de frío aire acondicionado etc, Supervisar contratistas, asignar recursos y garantizar calidad seguridad y cumplimiento de plazos,Detectar causas raíz implementar soluciones técnicas y minimizar tiempos de inactividad en equipos clave, Gestionar inventarios de repuestos implementar prácticas de ahorro energético y maximizar el rendimiento de los sistemas,Asegurar normas de seguridad, medio ambiente y refrigerantes elaborar KPIs y reportes técnicos/financieros para la gerencia, además de capacitar al equipo en nuevas tecnologías.', children: [{ name: 'Ezequiel Custillo', role: 'Coordinador', funciones: 'Control y estados de cuenta y liberación de pagos a proveedores,  Llevar el control de ejecución de las tareas de mantenimiento, Control y envió de insumos para ejecución de trabajos, Controlar el inventario de equipamiento y su estado, Controlar las tareas de proveedores externo, Visitas y relevamientos a tienda, Control y envíos de recambio de equipamientos, seguimientos y ejecución de actas municipales, Control de stock y seguimiento de insumos, Coordinación y ejecución de nuevas gestiones de franquiciados.' }, { name: 'Agustin Marino', role: 'Coordinador', funciones: 'Control y estados de cuenta y liberación de pagos a proveedores,  Llevar el control de ejecución de las tareas de mantenimiento, Control y envió de insumos para ejecución de trabajos, Controlar el inventario de equipamiento y su estado, Controlar las tareas de proveedores externo, Visitas y relevamientos a tienda, Control y envíos de recambio de equipamientos, seguimientos y ejecución de actas municipales, Control de stock y seguimiento de insumos, Coordinación y ejecución de nuevas gestiones de franquiciados.' }, { name: 'Diego Ambruso', role: 'Auditor/a', funciones: 'Control y estados de cuenta y liberación de pagos a proveedores,  Llevar el control de ejecución de las tareas de mantenimiento, Control y envió de insumos para ejecución de trabajos, Controlar el inventario de equipamiento y su estado, Controlar las tareas de proveedores externo, Visitas y relevamientos a tienda, Control y envíos de recambio de equipamientos, seguimientos y ejecución de actas municipales, Control de stock y seguimiento de insumos, Coordinación y ejecución de nuevas gestiones de franquiciados.' }, { name: 'Leopoldo Lopez', role: 'Auditor/a', funciones: 'Control y estados de cuenta y liberación de pagos a proveedores,  Llevar el control de ejecución de las tareas de mantenimiento, Control y envió de insumos para ejecución de trabajos, Controlar el inventario de equipamiento y su estado, Controlar las tareas de proveedores externo, Visitas y relevamientos a tienda, Control y envíos de recambio de equipamientos, seguimientos y ejecución de actas municipales, Control de stock y seguimiento de insumos, Coordinación y ejecución de nuevas gestiones de franquiciados.' }] }] };
    const electricoTeamData = { name: 'Roberta Di pace', role: 'Gerente de Electricidad', funciones: 'Responsable final del área de Servicios Generales, alineando los objetivos del sector con la estrategia de la compañía y asegurando la correcta ejecución presupuestaria.', children: [{ name: 'Juan Basini', role: 'Líder Eléctrico y de Auditores', funciones: 'Proponer y liderar los planes de inversión y mantenimiento eléctrico con el fin de garantizar las necesidades energéticas que requieran las actividades de la Compañía', children: [{ name: 'Matias Alvarez', role: 'Analista y auditor Administrativo Eléctrico', funciones: 'Asegurar el correcto control seguimiento y análisis de indicadores del área aportando así la mejora en la toma de decisiones de los referentes del área, Realizar los indicadores de productividad Realizar el seguimiento de mantenimiento correctivo y casos pendientes, Análisis de consumos de servicios reportes de workiva, Auditoria de servicios a tiendas', }] }] };
    const sedeTeamData = { name: 'Agustina Menendez', role: 'Coordinadora de Servicios de Oficina', funciones: 'Gestión del mantenimiento de la Sede Nacional y oficinas Centros Regionales,Coordinación y supervisión de trabajos,Elaboración de documentación técnica para proveedores,Solicitud y control de presupuestos,Seguimiento de tareas y control de plazos.', };
    const adminTeamData = { name: 'Pablo Rey', role: 'Responsable y coordinador de Administración', funciones: 'Armado control y seguimiento del budget anual (CAPEX y OPEX) incluyendo forecast mensual run rate y análisis de desvíos real vs presupuestado,Desarrollo de tableros financieros e informes ejecutivos para la toma de decisiones estratégicas, Detección temprana de desvíos presupuestarios y coordinación con áreas clave para su análisis y mitigación,Presentación de resultados mensuales armado de reportes e informes de performance para dirección y C-Level,Definición y seguimiento de KPIs operativos y financieros impulsando la mejora continua en los procesos administrativos ejecución de auditorías internas a procesos y proveedores asegurando cumplimiento y eficiencia operativa,Supervisión del cierre contable mensual y control de provisiones,Automatización de procesos internos reporting armado de planillas presentaciones y control de datos.', children: [{ name: 'Lucas Fernandez', role: 'Administrativo', funciones: 'Realización y seguimiento de SOLPED (FRÍO),Realización y envío de EM (FRÍO),Control de validaciones de tickets (FRÍO),Gestión de anulaciones de OC OPEX y CAPEX (FRÍO).', }, { name: 'Mercedes Jaunarena', role: 'Analista Administrativo', funciones: 'Control y seguimiento de facturación de proveedores,Análisis de productividad circuito administrativo Soporte AS400 P test y otros departamentos,Estado de cuenta Proveedores,Control y reclasificaciones de compras para Stock (CAPEX).', }, { name: 'Nestor Montenegro', role: 'Analista Administrativo', funciones: 'Imputación y control de tickets de OPEX y CAPEX (SSGG), Confección de reportes diarios Invgate, Fénix y lib. de OC,Estimación y envío diario de Aterrizaje OPEX, Control y elaboración de provisiones mensuales.', }, { name: 'Francisco Palumbo', role: 'Administrativo', funciones: 'Realización y seguimiento de SOLPED (SSGG, SEDE, CR y TE),Realización y envío de EM (SSGG, SEDE CR y TE),Control de validaciones de tickets (SSGG SEDE, CR y TE),Gestión de anulaciones de OC OPEX y CAPEX (SSGG, SEDE CR  TE).', }, { name: 'Carmen Sotomayor', role: 'Analista Administrativo', funciones: 'Imputación y control de tickets de OPEX y CAPEX (FRÍO CIVIL y ELECTRICIDAD),Confección y envío de reportes de tickets pendientes de aprb. de Fénix y segundos remitos,Estimación y envío diario de Aterrizaje OPEX,Control y elaboración de provisiones mensuales.', }, { name: 'Camilia Tripicchio', role: 'Analista Administrativo', funciones: 'Conciliación de cuentas contables de OPEX,Estado de cuenta Proveedores,Control y seguimiento del circuito administrativo,Control y reclasificaciones de compras para Stock (CAPEX).', }] };

    renderOrgChart('#ssgg-chart-container', ssggTeamData);
    renderOrgChart('#civil-chart-container', civilTeamData);
    renderOrgChart('#frio-chart-container', frioTeamData);
    renderOrgChart('#electrico-chart-container', electricoTeamData);
    renderOrgChart('#sede-chart-container', sedeTeamData);
    renderOrgChart('#admin-chart-container', adminTeamData);


    // ---- Sub-tabs: Organigrama vs Matriz de Criticidad ----
    function setupCriticidadToggle(sectionId, chartSel) {
      const section = root.querySelector(sectionId);
      if (!section) return;
      const chart = section.querySelector(chartSel);
      const table = section.querySelector('table');
      if (!chart || !table) return; // only create toggle if both exist

      // Create toolbar
      if (section.querySelector('.vf-crit-toolbar')) { return; }
      const toolbar = document.createElement('div');
      toolbar.className = 'vf-crit-toolbar flex gap-2 mb-4 items-center';
      const btnOrg = document.createElement('button');
      btnOrg.className = 'px-3 py-1 rounded-md border text-sm font-medium bg-white dark:bg-gray-800';
      btnOrg.textContent = 'Organigrama';
      const btnMat = document.createElement('button');
      btnMat.className = 'px-3 py-1 rounded-md border text-sm font-medium bg-white dark:bg-gray-800';
      btnMat.textContent = 'Matriz de Criticidad';
      toolbar.appendChild(btnOrg); toolbar.appendChild(btnMat);

      // Insert toolbar right after the section title (h2), or at top
      const h2 = section.querySelector('h2');
      if (h2 && h2.parentNode) {
        h2.parentNode.insertBefore(toolbar, h2.nextSibling);
      } else {
        section.insertBefore(toolbar, section.firstChild);
      }

      function activate(which) {
        if (which === 'org') {
          chart.style.display = 'block';
          table.style.display = 'none';
          btnOrg.classList.add('ring-1', 'ring-red-500');
          btnMat.classList.remove('ring-1', 'ring-red-500');
        } else {
          chart.style.display = 'none';
          table.style.display = 'table';
          btnMat.classList.add('ring-1', 'ring-red-500');
          btnOrg.classList.remove('ring-1', 'ring-red-500');
        }
      }
      btnOrg.addEventListener('click', () => activate('org'));
      btnMat.addEventListener('click', () => activate('mat'));

      // start showing Organigrama
      activate('org');
    }

    setupCriticidadToggle('#civil-section', '#civil-chart-container');
    setupCriticidadToggle('#frio-section', '#frio-chart-container');
    setupCriticidadToggle('#electrico-section', '#electrico-chart-container');

    const firstBtn = $$('.tab-button')[0];
    if (firstBtn) firstBtn.click();
  }
  window.__initOrganigramaVF = initOrganigramaVF;
  // Fallback init
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof window.__initOrganigramaVF === 'function') { try { window.__initOrganigramaVF(); } catch (e) { console.warn(e); } }
  });
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-panel="panel-organigrama-vf"]');
    if (link && typeof window.__initOrganigramaVF === 'function') { try { window.__initOrganigramaVF(); } catch (e) { console.warn(e); } }
  });
})();


/* === DAVOO UX Upgrade (accesibilidad + interacción) ===
   - Tabs accesibles (teclado)
   - Zoom/Pan del organigrama con toolbar (+/-/Reset)
   - Modal: ESC para cerrar y trap de foco básico
   Todo sin romper tu JS: solo se engancha si existen los elementos.
========================================================= */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    enhanceTabs();
    enhanceOrgZoom();
    enhanceModal();
  });

  function enhanceTabs() {
    const scopes = document.querySelectorAll('.organigrama-vf, .content-panel');
    scopes.forEach(scope => {
      const tabs = scope.querySelectorAll('.tab-button');
      const panels = scope.querySelectorAll('.tab-content');
      if (!tabs.length) return;

      // Roles ARIA
      const strip = scope.querySelector('.tab-strip') || scope;
      strip.setAttribute('role', 'tablist');
      tabs.forEach((btn, i) => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
        const target = btn.getAttribute('data-target');
        const panel = target ? scope.querySelector(target) : null;
        if (panel) {
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', `tab-${i}`);
          btn.id = `tab-${i}`;
        }
        btn.addEventListener('keydown', (e) => {
          const idx = Array.from(tabs).indexOf(btn);
          let next = null;
          if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
          if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
          if (next) {
            e.preventDefault();
            next.click();
            next.focus();
          }
        });
        btn.addEventListener('click', () => {
          tabs.forEach(b => b.setAttribute('tabindex', b.classList.contains('active') ? '0' : '-1'));
        });
      });
    });
  }

  function enhanceOrgZoom() {
    const wrapScope = document.querySelector('#panel-organigrama-vf .organigrama-vf') || document;
    const charts = wrapScope.querySelectorAll('.org-chart');
    charts.forEach(chart => {
      if (chart.dataset.zoomEnh === '1') return;
      chart.dataset.zoomEnh = '1';
      let scale = 1, tx = 0, ty = 0;
      const apply = () => chart.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;

      // Toolbar
      let toolbar = chart.parentElement.querySelector('.org-zoom-toolbar');
      if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.className = 'org-zoom-toolbar';
        toolbar.innerHTML = `<button type="button" data-a="minus">-</button>
                           <button type="button" data-a="plus">+</button>
                           <button type="button" data-a="reset">Reset</button>`;
        chart.parentElement.insertBefore(toolbar, chart);
      }
      toolbar.addEventListener('click', (e) => {
        const a = e.target && e.target.getAttribute('data-a');
        if (!a) return;
        if (a === 'plus') scale = Math.min(2.2, +(scale + 0.1).toFixed(2));
        if (a === 'minus') scale = Math.max(0.4, +(scale - 0.1).toFixed(2));
        if (a === 'reset') { scale = 1; tx = 0; ty = 0; }
        apply();
      });

      // Wheel zoom (Ctrl+wheel) y pan con arrastre
      chart.addEventListener('wheel', (e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.max(0.4, Math.min(2.2, +(scale + delta).toFixed(2)));
        apply();
      }, { passive: false });

      let dragging = false, lx = 0, ly = 0;
      chart.addEventListener('mousedown', (e) => { dragging = true; lx = e.clientX; ly = e.clientY; chart.style.cursor = 'grabbing'; });
      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        tx += e.clientX - lx; ty += e.clientY - ly; lx = e.clientX; ly = e.clientY; apply();
      });
      window.addEventListener('mouseup', () => { dragging = false; chart.style.cursor = 'default'; });
    });
  }

  function enhanceModal() {
    const modal = document.querySelector('#info-modal');
    if (!modal) return;
    const closeBtn = modal.querySelector('#modal-close-btn');
    const focusables = () => Array.from(modal.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
    const firstFocus = () => (focusables()[0] || closeBtn || modal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      } else if (e.key === 'Tab' && modal.classList.contains('active')) {
        const f = focusables();
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });

    // Focus al abrir
    const mo = new MutationObserver(() => { if (modal.classList.contains('active')) setTimeout(() => firstFocus().focus(), 10); });
    mo.observe(modal, { attributes: true, attributeFilter: ['class'] });
  }
})();

(function () {
  const reattach = () => { try { if (typeof enhanceOrgZoom === 'function') enhanceOrgZoom(); } catch (_) { } };
  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('[data-panel="panel-organigrama-vf"]');
    if (link) setTimeout(reattach, 60);
    if (e.target && e.target.classList && e.target.classList.contains('tab-button')) {
      setTimeout(reattach, 60);
    }
  });
  // MutationObserver por si el organigrama se inyecta asincrónicamente
  const panel = document.querySelector('#panel-organigrama-vf');
  if (panel && 'MutationObserver' in window) {
    const mo = new MutationObserver(() => reattach());
    mo.observe(panel, { childList: true, subtree: true });
  }
})();

/* === DAVOO Pro Pack – JS =====================================================
   - Chips de criticidad + barra de acciones (export CSV, copiar enlace, reset)
   - Deep link de filtros en URL
   - Command Palette (Ctrl/Cmd + K) con búsqueda de navegación
   - Toasts
   Respeta paleta y fuentes existentes.
==============================================================================*/
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    initCriticidadTables();
    initCommandPalette();
    setupA11yLive();
  });

  /* -------------------- Toasts -------------------- */
  function toast(msg, timeout = 2200) {
    let wrap = $('.dv-toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'dv-toast-wrap';
      document.body.appendChild(wrap);
    }
    const t = document.createElement('div');
    t.className = 'dv-toast';
    t.innerHTML = msg;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), timeout);
  }

  /* -------------- Criticidad tables -------------- */
  function initCriticidadTables() {
    // Scope: criticidad panels
    const panels = ['panel-criticidad-frio', 'panel-criticidad-electrico', 'panel-criticidad-civil', 'panel-criticidad-ssgg']
      .map(id => document.getElementById(id))
      .filter(Boolean);
    panels.forEach(panel => enhancePanel(panel));
    // Restore from URL if present
    restoreFiltersFromURL();
  }

  function enhancePanel(panel) {
    // Find all data tables (skip ones that clearly aren't matrices)
    const tables = $$('table', panel).filter(tb => /RUBRO/i.test(tb.innerText) && /CRITICIDAD/i.test(tb.innerText));
    tables.forEach(tb => mountFiltersForTable(tb));
  };

  // Initial filter after mount (in case URL has params)
  applyFilters(table, toolbar, colCrit, colDer);

  function makeChip(id, label, cls) {
    const b = document.createElement('button');
    b.className = `dv-chip ${cls}`;
    b.type = 'button';
    b.id = id;
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span class="dot"></span>${label}`;
    return b;
  }

  function getActiveValues(toolbar) {
    const crit = $$('[id^="crit-"][aria-pressed="true"]', toolbar).map(x => x.textContent.trim().toUpperCase());
    const der = $$('[id^="der-"][aria-pressed="true"]', toolbar).map(x => x.textContent.trim().toUpperCase());
    return { crit, der };
  }

  function applyFilters(table, toolbar, colCrit, colDer) {
    const { crit, der } = getActiveValues(toolbar);
    let visible = 0;
    $$('tbody tr', table).forEach(tr => {
      if (tr.classList.contains('dv-empty-row')) return;
      const tds = $$('td', tr).map(td => td.textContent.trim().toUpperCase());
      const okCrit = (crit.length === 0) || (colCrit >= 0 && crit.some(v => (tds[colCrit] || '').includes(v)));
      const okDer = (der.length === 0) || (colDer >= 0 && der.some(v => (tds[colDer] || '').includes(v)));
      const show = okCrit && okDer;
      tr.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const emptyRow = $('tbody .dv-empty-row', table);
    if (emptyRow) emptyRow.style.display = visible === 0 ? '' : 'none';
    // live region update
    const live = $('#dv-live');
    if (live) live.textContent = `Filtrado aplicado. ${visible} filas visibles.`;
  }

  function clearChips(toolbar) {
    $$('[aria-pressed="true"]', toolbar).forEach(x => x.setAttribute('aria-pressed', 'false'));
  }

  function exportVisibleRowsToCSV(table) {
    const rows = [];
    const headers = $$('thead th', table).map(th => cleanCSV(th.textContent));
    rows.push(headers.join(','));
    $$('tbody tr', table).forEach(tr => {
      if (tr.style.display === 'none' || tr.classList.contains('dv-empty-row')) return;
      const cols = $$('td', tr).map(td => cleanCSV(td.textContent));
      if (cols.length) rows.push(cols.join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'criticidad.csv'; a.click();
    URL.revokeObjectURL(url);
    toast('CSV exportado');
  }
  const cleanCSV = (t) => `"${t.replace(/"/g, '""').trim()}"`;

  /* ---------------- Deep link de filtros ---------------- */
  function updateURLFromFilters() {
    const params = new URLSearchParams(location.search);
    // serializamos por panel id
    ['panel-criticidad-frio', 'panel-criticidad-electrico', 'panel-criticidad-civil', 'panel-criticidad-ssgg'].forEach(pid => {
      const panel = document.getElementById(pid);
      if (!panel) return;
      const active = $$('[aria-pressed="true"]', panel);
      if (active.length === 0) { params.delete(pid); return; }
      params.set(pid, active.map(a => a.id).join('|'));
    });
    const newUrl = `${location.pathname}?${params.toString()}${location.hash}`;
    history.replaceState(null, '', newUrl);
  }
  function restoreFiltersFromURL() {
    const params = new URLSearchParams(location.search);
    params.forEach((v, key) => {
      if (!/^panel-criticidad-/.test(key)) return;
      const panel = document.getElementById(key);
      if (!panel) return;
      v.split('|').forEach(id => {
        const chip = panel.querySelector('#' + CSS.escape(id));
        if (chip) chip.setAttribute('aria-pressed', 'true');
      });
    });
  }

  /* ---------------- Command Palette ---------------- */
  function initCommandPalette() {
    const overlay = document.createElement('div');
    overlay.className = 'dv-kbar';
    overlay.innerHTML = `<div class="panel" role="dialog" aria-modal="true" aria-label="Buscar y navegar">
      <header><input type="text" placeholder="Buscar (personas, menús, tabs)..." aria-label="Buscar"/></header>
      <ul role="listbox"></ul>
    </div>`;
    document.body.appendChild(overlay);
    const input = $('input', overlay);
    const list = $('ul', overlay);

    function buildItems() {
      const items = [];
      // Menú lateral
      $$('#main-menu a, nav a').forEach(a => {
        const text = a.textContent.trim(); if (!text) return;
        items.push({ text, action: () => a.click() });
      });
      // Tabs
      $$('.tab-button').forEach(b => {
        const text = b.textContent.trim(); if (!text) return;
        items.push({ text: `Tab: ${text}`, action: () => b.click() });
      });
      // Anclas con id
      $$('h2[id], h3[id]').forEach(h => {
        items.push({ text: h.textContent.trim(), action: () => { location.hash = '#' + h.id; } });
      });
      return items;
    }
    let data = buildItems();
    function open() { overlay.classList.add('active'); input.value = ''; render(''); setTimeout(() => input.focus(), 0); }
    function close() { overlay.classList.remove('active'); }
    function render(q) {
      list.innerHTML = '';
      const qn = q.toLowerCase();
      data.filter(i => i.text.toLowerCase().includes(qn)).slice(0, 30).forEach((it, idx) => {
        const li = document.createElement('li'); li.textContent = it.text; li.tabIndex = 0;
        if (idx === 0) li.classList.add('active');
        li.addEventListener('click', () => { it.action(); close(); });
        list.appendChild(li);
      });
    }
    input.addEventListener('input', e => render(e.target.value));
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); data = buildItems(); open(); }
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });
  }

  /* ---------------- A11y live region ---------------- */
  function setupA11yLive() {
    let live = document.getElementById('dv-live');
    if (!live) {
      live = document.createElement('div');
      live.id = 'dv-live';
      live.setAttribute('aria-live', 'polite');
      live.className = 'sr-only';
      live.style.position = 'absolute'; live.style.left = '-9999px';
      document.body.appendChild(live);
    }
  }
  ;

  /* ===== Pro Pack v2 JS: Mini Gantt + Focus Path ============================== */
  (function () {
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    document.addEventListener('DOMContentLoaded', () => {
      try { mountMiniGantt(); } catch (e) { /* silent */ }
      try { mountFocusPath(); } catch (e) { /* silent */ }
    });

    /* ---------------- Mini Gantt (Cronograma) ---------------- */
    function mountMiniGantt() {
      const panel = document.getElementById('panel-cronograma') || document.body;
      if (!panel) return;
      const mountAfter = panel.querySelector('form') || panel.querySelector('.filters') || panel.querySelector('h1');
      const box = document.createElement('section');
      box.innerHTML = `<div class="dv-gantt" role="region" aria-label="Timeline de cuadrillas">
      <div class="head">
        <h3>Línea de Tiempo (semana actual)</h3>
        <div class="scale" id="dv-scale"></div>
      </div>
      <div class="body" id="dv-rows"></div>
    </div>`;
      (mountAfter?.parentNode || panel).insertBefore(box, mountAfter?.nextSibling || panel.firstChild);

      const start = startOfWeek(new Date());
      const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
      const scale = $('#dv-scale', box);
      days.forEach(d => {
        const el = document.createElement('div'); el.className = 'tick';
        el.textContent = d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit' });
        scale.appendChild(el);
      });

      const tasks = (window.CRONO_TASKS && Array.isArray(window.CRONO_TASKS)) ? window.CRONO_TASKS : [];
      // Build lanes by cuadrilla (or 'General' if not provided)
      const lanesMap = new Map();
      tasks.forEach(t => {
        const k = t.cuadrilla || 'General';
        if (!lanesMap.has(k)) lanesMap.set(k, []);
        lanesMap.get(k).push(t);
      });
      if (lanesMap.size === 0) {
        ['Cuadrilla A', 'Cuadrilla B'].forEach(k => lanesMap.set(k, []));
      }

      const rows = $('#dv-rows', box);
      [...lanesMap.keys()].forEach(lane => {
        const r = document.createElement('div'); r.className = 'row';
        const name = document.createElement('div'); name.className = 'lane'; name.textContent = lane;
        const track = document.createElement('div'); track.className = 'track';
        r.append(name, track); rows.appendChild(r);

        const laneTasks = lanesMap.get(lane) || [];
        laneTasks.forEach(t => {
          const task = document.createElement('div'); task.className = 'task';
          task.dataset.severity = t.severity || '';
          task.textContent = t.tienda ? `${t.tienda} · ${t.descripcion || ''}` : (t.descripcion || 'Tarea');
          const x = Math.max(0, daysBetween(start, parseDate(t.inicio)) * (track.clientWidth / 7));
          const w = Math.max(24, Math.max(1, daysBetween(parseDate(t.inicio), parseDate(t.fin)) + 1) * (track.clientWidth / 7) - 6);
          task.style.left = x + 'px';
          task.style.width = w + 'px';
          track.appendChild(task);
        });
      });

      function parseDate(s) {
        if (s instanceof Date) return s;
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { const [y, m, d] = s.split('-'); return new Date(+y, +m - 1, +d); }
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) { const [d, m, y] = s.split('/'); return new Date(+y, +m - 1, +d); }
        const dt = new Date(s); return isNaN(dt) ? new Date() : dt;
      }
      function startOfWeek(d) { const c = new Date(d); const day = (c.getDay() + 6) % 7; c.setDate(c.getDate() - day); c.setHours(0, 0, 0, 0); return c; }
      function addDays(d, n) { const x = new Date(d); x.setDate(d.getDate() + n); return x; }
      function daysBetween(a, b) { return Math.round((+startOfDay(b) - +startOfDay(a)) / 86400000); }
      function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
    }

    /* ---------------- Focus Path (Organigramas) ---------------- */
    function mountFocusPath() {
      const panel = document.getElementById('panel-organigrama-vf');
      if (!panel) return;
      const wrap = document.createElement('div');
      wrap.className = 'dv-org-search';
      wrap.innerHTML = `<input type="search" placeholder="Buscar persona (Focus Path)..." aria-label="Buscar persona">
    <div class="dv-org-tools">
      <button type="button" class="dv-btn" id="dv-focus-clear">Limpiar</button>
    </div>`;
      panel.insertBefore(wrap, panel.firstElementChild?.nextSibling || panel.firstChild);

      const input = wrap.querySelector('input');
      const btnClear = wrap.querySelector('#dv-focus-clear');
      btnClear.addEventListener('click', () => clearFocus(panel));

      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const q = input.value.trim().toLowerCase();
          focusQuery(panel, q);
        }
      });
    }

    function focusQuery(panel, q) {
      clearFocus(panel);
      if (!q) { return; }
      const nodes = findOrgNodes(panel);
      const matches = nodes.filter(n => n.textContent.trim().toLowerCase().includes(q));
      if (matches.length === 0) { return; }
      nodes.forEach(n => n.classList.add('org-dim'));
      matches.forEach(n => {
        n.classList.remove('org-dim'); n.classList.add('org-focus');
        let p = n.parentElement;
        const limit = panel;
        let safety = 0;
        while (p && p !== limit && safety++ < 50) {
          if (p.classList && /org|node|card/i.test(p.className)) {
            p.classList.remove('org-dim'); p.classList.add('org-focus');
          }
          p = p.parentElement;
        }
        if (matches[0] === n) { n.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      });
    }

    function clearFocus(panel) {
      const els = panel.querySelectorAll('.org-dim, .org-focus');
      els.forEach(el => { el.classList.remove('org-dim'); el.classList.remove('org-focus'); });
    }

    function findOrgNodes(panel) {
      let nodes = panel.querySelectorAll('[data-role="org-node"]');
      if (nodes.length) return Array.from(nodes);
      nodes = panel.querySelectorAll('.org-node, .orgcard, .org-card, .card, .node');
      if (nodes.length) return Array.from(nodes);
      const canvas = panel.querySelector('#org-canvas, #organigrama-canvas') || panel;
      nodes = Array.from(canvas.querySelectorAll('*')).filter(el => el.children.length === 0 && /\S/.test(el.textContent));
      return nodes;
    }
  })();

  /* === Pro Pack v3 JS: Organigrama – Colapsar Niveles + Minimap =============== */
  (function () {
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    document.addEventListener('DOMContentLoaded', () => {
      const panel = document.getElementById('panel-organigrama-vf');
      if (!panel) return;
      mountOps(panel);
      mountMinimap(panel);
    });

    function mountOps(panel) {
      let anchor = panel.querySelector('.dv-org-search');
      if (!anchor) {
        anchor = document.createElement('div');
        anchor.className = 'dv-org-search';
        panel.insertBefore(anchor, panel.firstChild);
      }
      const ops = document.createElement('div');
      ops.className = 'dv-org-ops';
      ops.innerHTML = `<div class="dv-seg" role="group" aria-label="Colapsar niveles">
      <button type="button" data-lvl="1" aria-pressed="false" title="Mostrar hasta nivel 1">1</button>
      <button type="button" data-lvl="2" aria-pressed="true" title="Mostrar hasta nivel 2">2</button>
      <button type="button" data-lvl="3" aria-pressed="false" title="Mostrar hasta nivel 3">3</button>
    </div>`;
      anchor.parentNode.insertBefore(ops, anchor.nextSibling);

      ops.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-lvl]');
        if (!btn) return;
        ops.querySelectorAll('button[data-lvl]').forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        const max = parseInt(btn.dataset.lvl, 10) || 2;
        collapseToLevel(panel, max);
      });

      collapseToLevel(panel, 2);
    }

    function collapseToLevel(panel, maxLevel) {
      const root = findOrgRoot(panel);
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll('.org-node, [data-role="org-node"], .orgcard, .org-card'));
      nodes.forEach(n => {
        const depth = computeDepth(n, root);
        const wrap = n.closest('.org-node-wrapper, li, .node, .card') || n;
        if (depth > maxLevel) {
          wrap.classList.add('org-hidden');
        } else {
          wrap.classList.remove('org-hidden');
        }
      });
    }

    function computeDepth(el, limit) {
      let d = 1,
        p = el.parentElement;
      while (p && p !== limit) {
        if (p.classList && (p.classList.contains('org-children') || p.tagName.toLowerCase() === 'li')) d++;
        p = p.parentElement;
      }
      return d;
    }

    function findOrgRoot(panel) {
      return panel.querySelector('.org-chart, #organigrama-canvas, #org-canvas') || panel.querySelector('.organigrama-vf') || panel;
    }

    /* ------------------------ Minimap ------------------------ */
    function mountMinimap(panel) {
      const root = findOrgRoot(panel);
      if (!root) return;
      let scroller = root;
      let p = root.parentElement;
      while (p && p !== panel) {
        const overflowX = getComputedStyle(p).overflowX;
        const overflowY = getComputedStyle(p).overflowY;
        if ((overflowX === 'auto' || overflowX === 'scroll') || (overflowY === 'auto' || overflowY === 'scroll')) {
          scroller = p;
          break;
        }
        p = p.parentElement;
      }

      const mm = document.createElement('aside');
      mm.className = 'dv-minimap';
      mm.innerHTML = `<div class="title">Minimapa</div><div class="wrap"><canvas></canvas><span class="hint">arrastrá</span></div>`;
      panel.appendChild(mm);

      const canvas = mm.querySelector('canvas');
      const ctx = canvas.getContext('2d');

      function draw() {
        const cw = canvas.clientWidth,
          ch = canvas.clientHeight;
        canvas.width = cw;
        canvas.height = ch;
        const contentW = root.scrollWidth;
        const contentH = root.scrollHeight;
        if (!contentW || !contentH) return;
        const viewW = scroller.clientWidth;
        const viewH = scroller.clientHeight;
        const sx = scroller.scrollLeft;
        const sy = scroller.scrollTop;

        ctx.clearRect(0, 0, cw, ch);
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, cw, ch);
        const scale = Math.min(cw / contentW, ch / contentH);
        const padX = (cw - contentW * scale) / 2;
        const padY = (ch - contentH * scale) / 2;

        ctx.strokeStyle = 'rgba(0,0,0,.15)';
        ctx.strokeRect(padX, padY, contentW * scale, contentH * scale);

        ctx.fillStyle = 'rgba(225,29,72,.12)';
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--dia-red') || '#e11d48';
        ctx.lineWidth = 2;
        ctx.fillRect(padX + sx * scale, padY + sy * scale, viewW * scale, viewH * scale);
        ctx.strokeRect(padX + sx * scale, padY + sy * scale, viewW * scale, viewH * scale);
      }

      scroller.addEventListener('scroll', draw, { passive: true });
      window.addEventListener('resize', draw);
      const ro = new ResizeObserver(draw);
      ro.observe(root);
      ro.observe(scroller);

      let dragging = false;
      mm.addEventListener('mousedown', (e) => {
        dragging = true;
        moveToEvent(e);
      });
      window.addEventListener('mousemove', (e) => {
        if (dragging) moveToEvent(e);
      });
      window.addEventListener('mouseup', () => dragging = false);

      function moveToEvent(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const contentW = root.scrollWidth;
        const contentH = root.scrollHeight;
        const viewW = scroller.clientWidth;
        const viewH = scroller.clientHeight;
        const cw = canvas.clientWidth,
          ch = canvas.clientHeight;
        const scale = Math.min(cw / contentW, ch / contentH);
        const padX = (cw - contentW * scale) / 2;
        const padY = (ch - contentH * scale) / 2;
        const targetX = Math.max(0, (x - padX) / scale - viewW / 2);
        const targetY = Math.max(0, (y - padY) / scale - viewH / 2);
        scroller.scrollLeft = Math.min(targetX, contentW - viewW);
        scroller.scrollTop = Math.min(targetY, contentH - viewH);
        draw();
      }
      setTimeout(draw, 60);
    }
  })();

  /* dv-auto-turno */
  (function () {
    const mapIdx = { lunes: 0, martes: 1, miércoles: 2, miercoles: 2, jueves: 3, viernes: 4, sábado: 5, sabado: 5, domingo: 6 };
    const fmt = new Intl.DateTimeFormat('es-AR', { weekday: 'long' });
    const weekday = fmt.format(new Date()).toLowerCase();
    const dayIdx = mapIdx[weekday] ?? 0;

    function normalizeText(s) {
      return (s || "").replace(/\s+/g, " ").trim().toUpperCase();
    }

    function parseHoras(txt) {
      const m = txt.match(/(\d{1,2})\s*a\s*(\d{1,2})\s*0?hs/i);
      if (!m) return null;
      let ini = parseInt(m[1], 10),
        fin = parseInt(m[2], 10);
      if (fin === 0) fin = 24;
      return [ini * 60, fin * 60];
    }

    function estaEnTurno(rango, minutosAhora) {
      if (!rango) return false;
      let [ini, fin] = rango;
      if (fin > ini) return (minutosAhora >= ini && minutosAhora < fin);
      return (minutosAhora >= ini) || (minutosAhora < fin);
    }

    const now = new Date();
    const minutosAhora = now.getHours() * 60 + now.getMinutes();

    document.querySelectorAll('[id^="agent-card-"]').forEach(card => {
      card.querySelectorAll('span,div,b,strong,em,i').forEach(el => {
        if (normalizeText(el.textContent) === 'EN TURNO') {
          el.remove();
        }
      });

      const grid = card.querySelector('.grid');
      if (!grid) return;
      const cells = Array.from(grid.children).slice(0, 7);
      const cell = cells[dayIdx];
      if (!cell) return;

      if (/libre|franco/i.test(cell.textContent)) return;

      const rango = parseHoras(cell.textContent);
      if (!rango) return;

      if (estaEnTurno(rango, minutosAhora)) {
        const host = card.querySelector('h3, h4, .flex.items-center') || card;
        const badge = document.createElement('span');
        badge.setAttribute('data-turno-badge', '1');
        badge.className = 'ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700';
        badge.textContent = 'EN TURNO';
        host.appendChild(badge);
      }
    });
  })();

  /* Remove Focus Path / Buscar persona UI + Limpiar + botones 1/2/3 */
  (function () {
    function removeFocusUI(root) {
      root = root || document;
      const inputs = root.querySelectorAll(
        'input[placeholder*="Focus Path" i], input[placeholder*="Buscar persona" i]'
      );

      inputs.forEach((inp) => {
        const container =
          inp.closest('.dv-org-search, .org-toolbar, .dv-org-ops, .focus-toolbar, .org-focus-toolbar, .toolbar, .relative, .search, .search-bar, form, div') ||
          inp.parentElement;
        if (container && container.parentElement) {
          container.parentElement.removeChild(container);
        } else if (container) {
          container.remove();
        } else {
          inp.remove();
        }
      });

      (root.querySelectorAll('button, a') || []).forEach((el) => {
        const txt = (el.textContent || '').trim().toLowerCase();
        if (txt === 'limpiar') {
          const holder = el.closest('.dv-org-search, .org-toolbar, .dv-org-ops, .focus-toolbar, .org-focus-toolbar, .toolbar, [role="search"], form');
          if (holder && holder.parentElement) holder.parentElement.removeChild(holder);
          else el.remove();
        }
      });

      (root.querySelectorAll('button, .btn, a') || []).forEach((btn) => {
        const txt = (btn.textContent || '').trim();
        if (/^[123]$/.test(txt)) {
          const group = btn.parentElement;
          if (group) {
            const labels = Array.from(group.children).map((c) => (c.textContent || '').trim());
            const only123 = labels.length > 0 && labels.every((t) => /^[123]$/.test(t));
            if (only123) {
              if (group.parentElement) group.parentElement.removeChild(group);
              else group.remove();
            }
          }
        }
      });
    }

    function run() {
      removeFocusUI(document);
    }

    if (document.readyState !== 'loading') run();
    else document.addEventListener('DOMContentLoaded', run);

    try {
      const mo = new MutationObserver(() => run());
      mo.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (e) {
      // noop
    }
  })();

  /* ssgg-visual-v13 */
  (function () {
    function $(sel, root) {
      return (root || document).querySelector(sel);
    }

    function $all(sel, root) {
      return Array.from((root || document).querySelectorAll(sel));
    }

    function findCardByName(container, name) {
      const target = name.toLowerCase();
      const cards = $all('.card', container);
      for (const c of cards) {
        const nm = (c.querySelector('.card-name') || {}).textContent || c.textContent || '';
        const t = nm.trim().toLowerCase();
        if (t === target || t.includes(target)) return c;
      }
      return null;
    }

    function ensureLayer(container) {
      let layer = container.querySelector('.ssgg-aux-layer');
      if (!layer) {
        layer = document.createElement('div');
        layer.className = 'ssgg-aux-layer';
        layer.innerHTML = '<svg></svg>';
        container.appendChild(layer);
      }
      const svg = layer.querySelector('svg');
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      return svg;
    }

    function relRect(container, el) {
      const cr = container.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        left: r.left - cr.left,
        top: r.top - cr.top,
        width: r.width,
        height: r.height,
        right: r.right - cr.left,
        bottom: r.bottom - cr.top
      };
    }

    function drawH(svg, x1, x2, y) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', `M ${x1} ${y} H ${x2}`);
      p.setAttribute('class', 'ssgg-aux-path');
      svg.appendChild(p);
    }

    function drawV(svg, x, y1, y2) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', `M ${x} ${y1} V ${y2}`);
      p.setAttribute('class', 'ssgg-aux-path');
      svg.appendChild(p);
    }

    function applyShift(card, dx, dy) {
      if (!card) return;
      card.classList.add('ssgg-shift');
      if (dx != null) card.style.setProperty('--shift-x', (dx | 0) + 'px');
      if (dy != null) card.style.setProperty('--shift-y', (dy | 0) + 'px');
    }

    function clearShift(card) {
      if (!card) return;
      card.classList.remove('ssgg-shift');
      card.style.removeProperty('--shift-x');
      card.style.removeProperty('--shift-y');
    }

    function alignYTo(target, anchor) {
      if (!target || !anchor) return;
      const dy = Math.round(anchor.getBoundingClientRect().top - target.getBoundingClientRect().top);
      if (dy !== 0) applyShift(target, null, dy);
    }

    function centerJuan(container, juan, patricio) {
      if (!juan || !patricio) return;
      const ul = juan.closest('li') && juan.closest('li').parentElement;
      if (!ul) return;
      const ulRect = ul.getBoundingClientRect();
      const pRect = patricio.getBoundingClientRect();
      const jRect = juan.getBoundingClientRect();
      const targetCx = (ulRect.left + (pRect.left + pRect.width / 2)) / 2;
      const juanCx = jRect.left + jRect.width / 2;
      const dx = Math.round(targetCx - juanCx);
      if (Math.abs(dx) > 1) applyShift(juan, dx, null);
    }

    function ensureJonathanNextToNatalia(container, nat) {
      if (!nat) return null;
      const natLI = nat.closest('li');
      const parentUL = natLI && natLI.parentElement;
      if (!parentUL) return null;
      let jon = findCardByName(container, 'Jonathan');
      if (jon) {
        const jonLI = jon.closest('li');
        if (jonLI && natLI && natLI.nextSibling !== jonLI) {
          parentUL.insertBefore(jonLI, natLI.nextSibling);
        }
        return jon;
      }
      const li = document.createElement('li');
      li.innerHTML = '<div class="card"><div class="card-name">Jonathan Ferro</div><div class="card-role">Analista de procesos y Analista mantenimiento</div></div>';
      parentUL.insertBefore(li, natLI.nextSibling);
      return li.querySelector('.card');
    }

    let rafId = 0;

    function queueRender() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(render);
    }

    function render() {
      const cont = $('#ssgg-chart-container');
      if (!cont) return;
      const svg = ensureLayer(cont);
      const roberta = findCardByName(cont, 'Roberta Di Pace') || findCardByName(cont, 'Responsable');
      const patricio = findCardByName(cont, 'Patricio Varela');
      const juan = findCardByName(cont, 'Juan Basini');
      const david = findCardByName(cont, 'David Diaz');
      const natalia = findCardByName(cont, 'Natalia Gonzalez') || findCardByName(cont, 'Natalia');
      const jon = ensureJonathanNextToNatalia(cont, natalia) || findCardByName(cont, 'Jonathan');
      [natalia, jon, juan].forEach(clearShift);
      if (david) {
        if (natalia) alignYTo(natalia, david);
        if (jon) alignYTo(jon, david);
      }
      if (juan && patricio) centerJuan(cont, juan, patricio);
      if (!roberta) return;
      const rr = relRect(cont, roberta);
      const startY = rr.top + rr.height / 2;
      const startX = rr.right;
      const targets = [];
      if (natalia) {
        const nr = relRect(cont, natalia);
        targets.push({
          x: nr.left + nr.width / 2,
          y: nr.top
        });
      }
      if (jon) {
        const jr = relRect(cont, jon);
        targets.push({
          x: jr.left + jr.width / 2,
          y: jr.top
        });
      }
      if (targets.length) {
        const endX = Math.max(...targets.map(t => t.x));
        drawH(svg, startX, endX, startY);
        targets.forEach(t => drawV(svg, t.x, startY, t.y));
      }
    }

    function addScrollListeners(el) {
      if (!el) return;
      el.addEventListener('scroll', queueRender, {
        passive: true
      });
      let p = el.parentElement;
      while (p && p !== document.body) {
        p.addEventListener('scroll', queueRender, {
          passive: true
        });
        p = p.parentElement;
      }
    }

    function ready(fn) {
      if (document.readyState !== 'loading') fn();
      else document.addEventListener('DOMContentLoaded', fn);
    }
    ready(function () {
      const cont = document.getElementById('ssgg-chart-container');
      if (!cont) return;
      const mo = new MutationObserver(() => queueRender());
      mo.observe(cont, {
        childList: true,
        subtree: true
      });
      window.addEventListener('resize', queueRender, {
        passive: true
      });
      window.addEventListener('scroll', queueRender, {
        passive: true
      });
      document.addEventListener('scroll', queueRender, {
        passive: true
      });
      addScrollListeners(cont);
      setTimeout(queueRender, 450);
    });
  })();

  /* ssgg-center-juan-patch */
  (function () {
    const GAP = 20;
    const MAX_RETRIES = 60;
    let tries = 0;

    function $(s, r) {
      return (r || document).querySelector(s);
    }

    function $all(s, r) {
      return Array.from((r || document).querySelectorAll(s));
    }

    function findCardByName(name) {
      const needle = (name || '').trim().toLowerCase();
      const nodes = $all('.card, [data-node], .node, .org-node');
      for (const el of nodes) {
        const txt = (el.textContent || '').trim().toLowerCase();
        if (txt.includes(needle)) return el;
      }
      return null;
    }

    function clearShift(el) {
      if (!el) return;
      el.classList.remove('ssgg-shift');
      el.style.removeProperty('--shift-x');
      el.style.removeProperty('--shift-y');
    }

    function shift(el, dx) {
      if (!el) return;
      el.classList.add('ssgg-shift');
      el.style.setProperty('--shift-x', (Math.round(dx) || 0) + 'px');
    }

    function redrawConnectors() {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            const cont = $('#ssgg-chart-container') || document;
            cont.dispatchEvent(new Event('ssgg-redraw', {
              bubbles: true
            }));
          } catch (e) { }
          try {
            if (window.SSGG && typeof window.SSGG.redraw === 'function') window.SSGG.redraw();
          } catch (e) { }
        });
      });
    }

    function computeAndApply() {
      const juan = findCardByName('juan basini');
      const patri = findCardByName('patricio varela');
      if (!juan || !patri) {
        if (tries++ < MAX_RETRIES) return void setTimeout(computeAndApply, 120);
        return;
      }
      clearShift(juan);
      const jr = juan.getBoundingClientRect();
      const pr = patri.getBoundingClientRect();
      const targetRight = pr.left - GAP;
      const dx = Math.round(targetRight - jr.right);
      if (Math.abs(dx) > 1) shift(juan, dx);
      redrawConnectors();
    }

    function render() {
      requestAnimationFrame(computeAndApply);
    }
    if (document.readyState !== 'loading') render();
    else document.addEventListener('DOMContentLoaded', render);
    window.addEventListener('resize', render);
    window.addEventListener('orientationchange', render);
  })();

  /* davoo-normalize-criticality */
  (function () {
    const MAP = {
      "Critico": "Crítico",
      "critico": "crítico",
      "Critica": "Crítica",
      "critica": "crítica"
    };

    function fixNode(node) {
      const t = node.textContent;
      if (!t) return;
      const replaced = t.replace(/\b(Critico|critico|Critica|critica)\b/g, (m) => MAP[m] || m);
      if (replaced !== t) node.textContent = replaced;
    }

    function walk(root) {
      try {
        const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        const nodes = [];
        while (tw.nextNode()) nodes.push(tw.currentNode);
        nodes.forEach(fixNode);
      } catch (e) { }
    }

    function run() {
      walk(document.body);
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    try {
      const mo = new MutationObserver((muts) => {
        muts.forEach((m) => {
          if (m.type === "childList") {
            m.addedNodes && m.addedNodes.forEach((n) => walk(n));
          } else if (m.type === "characterData") {
            fixNode(m.target);
          }
        });
      });
      mo.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    } catch (e) { }
  })();

  /* davoo-v6-js */
  (function () {
    function enhanceTabs() {
      document.querySelectorAll('[role="tablist"]').forEach(tablist => {
        const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
        if (!tabs.length) return;
        tabs.forEach(t => t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1);
        tablist.addEventListener('keydown', (ev) => {
          const current = document.activeElement;
          if (!tabs.includes(current)) return;
          let i = tabs.indexOf(current);
          if (ev.key === 'ArrowRight') {
            i = (i + 1) % tabs.length;
            ev.preventDefault();
            tabs[i].focus();
          } else if (ev.key === 'ArrowLeft') {
            i = (i - 1 + tabs.length) % tabs.length;
            ev.preventDefault();
            tabs[i].focus();
          } else if (ev.key === 'Home') {
            i = 0;
            ev.preventDefault();
            tabs[i].focus();
          } else if (ev.key === 'End') {
            i = tabs.length - 1;
            ev.preventDefault();
            tabs[i].focus();
          }
        });
        tabs.forEach(t => {
          t.addEventListener('click', () => {
            tabs.forEach(x => {
              x.setAttribute('aria-selected', 'false');
              x.tabIndex = -1;
            });
            t.setAttribute('aria-selected', 'true');
            t.tabIndex = 0;
            t.focus();
          });
        });
      });
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        try {
          enhanceTabs();
        } catch (e) { }
      });
    } else {
      try {
        enhanceTabs();
      } catch (e) { }
    }
  })();

  /* davoo-hotfix-filters */
  (function () {
    function getValues(data, key) {
      try {
        return data.map(it => {
          if (!it) return null;
          if (it[key] !== undefined) return it[key];
          const low = key.toLowerCase();
          for (const k in it) {
            if (k && k.toLowerCase() === low) return it[k];
          }
          return null;
        }).filter(Boolean);
      } catch (e) {
        return [];
      }
    }
    window.populateFilters = function (data) {
      try {
        const provinciaFilter = document.getElementById('provincia-filter');
        const localidadFilter = document.getElementById('localidad-filter');
        if (!provinciaFilter || !localidadFilter) return;
        const provincias = Array.from(new Set(getValues(data, 'Provincia'))).sort();
        const localidades = Array.from(new Set(getValues(data, 'Localidad'))).sort();
        const opt = (v) => `<option value="${String(v).replace(/"/g, '&quot;')}">${v}</option>`;
        provinciaFilter.innerHTML = '<option value="">Todas</option>' + provincias.map(opt).join('');
        localidadFilter.innerHTML = '<option value="">Todas</option>' + localidades.map(opt).join('');
      } catch (e) {
        console.error('populateFilters hotfix', e);
      }
    };
  })();

  /* davoo-orgbar-calc */
  (function () {
    function update() {
      const cont = document.querySelector('#ssgg-chart-container .org-node-wrapper > .org-children');
      if (!cont) return;
      const kids = Array.from(cont.children).filter(el => el.classList && el.classList.contains('org-node-wrapper'));
      if (kids.length < 2) return;
      const rect = cont.getBoundingClientRect();
      const c1 = kids[0].getBoundingClientRect().left + kids[0].getBoundingClientRect().width / 2 - rect.left;
      const c2 = kids[kids.length - 1].getBoundingClientRect().left + kids[kids.length - 1].getBoundingClientRect().width / 2 - rect.left;
      const a = Math.min(c1, c2),
        b = Math.max(c1, c2);
      const left = (a / rect.width) * 100;
      const width = ((b - a) / rect.width) * 100;
      cont.style.setProperty('--bar-left', left + '%');
      cont.style.setProperty('--bar-width', width + '%');
    }
    window.addEventListener('resize', update);
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => update());
      window.addEventListener('load', () => {
        const cont = document.querySelector('#ssgg-chart-container .org-node-wrapper > .org-children');
        if (cont) ro.observe(cont);
        update();
      });
    } else {
      window.addEventListener('load', update);
    }
  })()
} 