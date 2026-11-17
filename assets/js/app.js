    // System State Variables
    let currentView = 'office';
    let isOffline = false;
    let offlineBufferCount = 0;
    let isThermalAlertActive = false;
    let currentTemp = 4.2;
    let chartInstance = null;

    // View Switching
    function switchView(view) {
      currentView = view;
      const viewOffice = document.getElementById('viewOffice');
      const viewDriver = document.getElementById('viewDriver');
      const btnOffice = document.getElementById('btnViewOffice');
      const btnDriver = document.getElementById('btnViewDriver');

      if (view === 'office') {
        viewOffice.classList.remove('hidden');
        viewDriver.classList.add('hidden');
        btnOffice.className = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-brand-600 text-white shadow-md";
        btnDriver.className = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white";
      } else {
        viewOffice.classList.add('hidden');
        viewDriver.classList.remove('hidden');
        btnDriver.className = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-brand-600 text-white shadow-md";
        btnOffice.className = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white";
        // Resize canvas if needed
        setTimeout(initSignaturePad, 100);
      }
    }

    // Modal Pitch Toggle
    function togglePitchModal() {
      const modal = document.getElementById('modalPitch');
      modal.classList.toggle('hidden');
    }

    // Toast Notification Utility
    function showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      
      let borderClass = 'border-brand-500 bg-slate-900 text-white';
      let icon = 'fa-solid fa-circle-info text-brand-400';
      if (type === 'success') {
        borderClass = 'border-emerald-500 bg-slate-900 text-white';
        icon = 'fa-solid fa-circle-check text-emerald-400';
      } else if (type === 'warning') {
        borderClass = 'border-amber-500 bg-slate-900 text-white';
        icon = 'fa-solid fa-triangle-exclamation text-amber-400';
      } else if (type === 'danger') {
        borderClass = 'border-rose-500 bg-slate-900 text-white';
        icon = 'fa-solid fa-circle-exclamation text-rose-400';
      }

      toast.className = `p-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs pointer-events-auto transform transition duration-300 translate-y-2 opacity-0 ${borderClass}`;
      toast.innerHTML = `<i class="${icon} text-base"></i><span>${message}</span>`;
      
      container.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      });

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 8000);
    }

    // Chart.js Live Telemetry Initialization
    function initChart() {
      const ctx = document.getElementById('telemetryChart').getContext('2d');
      const initialLabels = ['08:00', '08:03', '08:06', '08:09', '08:12', '08:15'];
      const initialData = [3.9, 4.1, 4.0, 4.3, 4.2, 4.2];

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: initialLabels,
          datasets: [{
            label: 'Temperatura (°C)',
            data: initialData,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: '#38bdf8',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              min: 0,
              max: 10,
              grid: { color: 'rgba(51, 65, 85, 0.4)' },
              ticks: { 
                color: '#94a3b8',
                callback: function(value) { return value + '°C'; }
              }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    // Simulate OR-Tools Dynamic Route Recalculation (RF-04 & RNF-04)
    function triggerORToolsRecalculation() {
      const btn = document.getElementById('btnRecalculate');
      const box = document.getElementById('recalcStatBox');
      const badge = document.getElementById('mapStatusBadge');
      const eventText = document.getElementById('mapEventText');
      
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Procesando VRPTW...`;

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Ruta Recalculada`;
        box.classList.remove('hidden');
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40";
        badge.innerText = "Recálculo Aplicado: Evita Gral. Paz";
        eventText.innerText = "Nueva secuencia enviada a App Chofer: Se prioriza Palermo (08:30 AM) por Colectora Este.";
        
        showToast("OR-Tools procesó 15 rutas en 240 ms. Notificación push enviada al chofer.", "success");

        setTimeout(() => {
          btn.innerHTML = `<i class="fa-solid fa-microchip"></i> Recalcular con OR-Tools (RF-04)`;
        }, 5000);
      }, 350); // Simulated 350ms engine processing latency
    }

    function simulateTrafficEvent() {
      const eventText = document.getElementById('mapEventText');
      eventText.innerHTML = `<strong class="text-rose-400">ALERTA VIAL:</strong> Corte total en empalme Av. Gral Paz y Panamericana. Tráfico demorado +28 min.`;
      showToast("Corte en Gral. Paz detectado. Se sugiere recálculo dinámico con OR-Tools.", "warning");
    }

    // Thermal Breach Simulation (RF-03 & SENASA CAA 154 bis)
    function simulateThermalBreach() {
      isThermalAlertActive = true;
      currentTemp = 8.6;
      updateThermalDisplays();

      // Add high spike point to chart
      if (chartInstance) {
        chartInstance.data.labels.push('08:18');
        chartInstance.data.datasets[0].data.push(8.6);
        chartInstance.data.datasets[0].borderColor = '#f43f5e';
        chartInstance.data.datasets[0].pointBackgroundColor = '#f43f5e';
        if (chartInstance.data.labels.length > 7) {
          chartInstance.data.labels.shift();
          chartInstance.data.datasets[0].data.shift();
        }
        chartInstance.update();
      }

      showToast("ALERTA CRÍTICA: Furgón #12 superó los 8.0°C durante 3 minutos continuos (8.6°C). Evento asentado en auditoría.", "danger");
    }

    function resetThermalState() {
      isThermalAlertActive = false;
      currentTemp = 4.1;
      updateThermalDisplays();

      if (chartInstance) {
        chartInstance.data.labels.push('08:21');
        chartInstance.data.datasets[0].data.push(4.1);
        chartInstance.data.datasets[0].borderColor = '#38bdf8';
        chartInstance.data.datasets[0].pointBackgroundColor = '#38bdf8';
        if (chartInstance.data.labels.length > 7) {
          chartInstance.data.labels.shift();
          chartInstance.data.datasets[0].data.shift();
        }
        chartInstance.update();
      }

      showToast("Temperatura de furgón restablecida a rango normal conforme SENASA (4.1°C).", "success");
    }

    function updateThermalDisplays() {
      const kpi = document.getElementById('kpiAvgTemp');
      const txt = document.getElementById('txtCurrentTemp');
      const badge = document.getElementById('badgeThermalState');
      const appBadge = document.getElementById('appTempBadge');

      kpi.innerText = currentTemp + '°C';
      txt.innerText = currentTemp + '°C';
      appBadge.innerText = currentTemp + '°C';

      if (isThermalAlertActive) {
        kpi.className = "text-2xl font-black text-rose-500 mt-1 animate-pulse";
        txt.className = "font-mono font-bold text-rose-400 text-sm";
        badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40";
        badge.innerText = "¡ALERTA FRÍO (>8°C)!";
        appBadge.className = "font-bold font-mono text-rose-400 animate-pulse";
      } else {
        kpi.className = "text-2xl font-black text-cyan-400 mt-1";
        txt.className = "font-mono font-bold text-cyan-400 text-sm";
        badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
        badge.innerText = "Conforme SENASA";
        appBadge.className = "font-bold font-mono text-cyan-300";
      }
    }

    // Driver App Offline Buffer Switch (RNF-03)
    function toggleOfflineMode() {
      isOffline = !isOffline;
      const btn = document.getElementById('btnToggleOffline');
      const lbl = document.getElementById('lblNetworkState');
      const buffer = document.getElementById('bufferStatusLabel');
      const netIcon = document.getElementById('phoneNetworkIcon');

      if (isOffline) {
        btn.className = "px-2.5 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 bg-amber-500/20 text-amber-200 border-amber-400";
        lbl.innerText = "Subsuelo (Sin Señal)";
        netIcon.className = "fa-solid fa-plane text-amber-400";
        offlineBufferCount = 12;
        buffer.innerText = `Buffer: ${offlineBufferCount} / 500 reg.`;
        showToast("Modo Offline activado: Subsuelo sin cobertura 4G. Persistencia en buffer local.", "warning");
      } else {
        btn.className = "px-2.5 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 bg-emerald-500/20 text-emerald-200 border-emerald-400";
        lbl.innerText = "Online 4G";
        netIcon.className = "fa-solid fa-wifi text-emerald-400";
        
        // Show rapid sync animation
        buffer.innerText = "Sincronizando lote...";
        setTimeout(() => {
          offlineBufferCount = 0;
          buffer.innerText = "Buffer: 0 / 500 reg.";
          showToast("RNF-03 Verificado: 12 registros del buffer sincronizados en 2.1s (< 15s). Cero datos perdidos.", "success");
        }, 900);
      }
    }

    // Mobile App Screen Transitions
    function openDeliveryForm() {
      document.getElementById('driverScreenStops').classList.add('hidden');
      document.getElementById('driverScreenEPOD').classList.remove('hidden');
      setTimeout(initSignaturePad, 50);
    }

    function cancelDeliveryForm() {
      document.getElementById('driverScreenEPOD').classList.add('hidden');
      document.getElementById('driverScreenStops').classList.remove('hidden');
    }

    function openIncidentModal() {
      document.getElementById('driverScreenStops').classList.add('hidden');
      document.getElementById('driverScreenIncident').classList.remove('hidden');
    }

    function cancelIncidentForm() {
      document.getElementById('driverScreenIncident').classList.add('hidden');
      document.getElementById('driverScreenStops').classList.remove('hidden');
    }

    // Signature Pad Canvas Logic (RF-02)
    let isDrawing = false;
    let canvas, ctxCanvas;

    function initSignaturePad() {
      canvas = document.getElementById('signatureCanvas');
      if (!canvas) return;
      ctxCanvas = canvas.getContext('2d');
      
      // Set responsive internal pixel dimensions
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      ctxCanvas.strokeStyle = "#0284c7";
      ctxCanvas.lineWidth = 2.5;
      ctxCanvas.lineCap = "round";

      // Mouse events
      canvas.onmousedown = (e) => {
        isDrawing = true;
        document.getElementById('sigPlaceholder').classList.add('hidden');
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(e.offsetX, e.offsetY);
      };
      canvas.onmousemove = (e) => {
        if (!isDrawing) return;
        ctxCanvas.lineTo(e.offsetX, e.offsetY);
        ctxCanvas.stroke();
      };
      window.onmouseup = () => { isDrawing = false; };

      // Touch events
      canvas.ontouchstart = (e) => {
        e.preventDefault();
        isDrawing = true;
        document.getElementById('sigPlaceholder').classList.add('hidden');
        const rect = canvas.getBoundingClientRect();
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      };
      canvas.ontouchmove = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctxCanvas.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        ctxCanvas.stroke();
      };
      canvas.ontouchend = () => { isDrawing = false; };
    }

    function clearSignatureCanvas() {
      if (!canvas || !ctxCanvas) return;
      ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);
      document.getElementById('sigPlaceholder').classList.remove('hidden');
    }

    function confirmDigitalDelivery() {
      const name = document.getElementById('inputReceiverName').value.trim();
      if (!name) {
        showToast("Por favor ingrese el nombre y apellido del receptor.", "warning");
        return;
      }

      showToast("¡Remito Digital firmado e inmutable generado! Facturación a 30 días habilitada en Administración.", "success");
      cancelDeliveryForm();

      // Update Stop 1 visual state
      const row = document.getElementById('stopsTableBody').children[0];
      row.children[4].innerHTML = `<span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">Entregado 08:22</span>`;
    }

    function simulateLiveCameraCapture() {
      const box = document.getElementById('incidentPhotoBox');
      const text = document.getElementById('txtPhotoStatus');
      box.className = "bg-emerald-950/40 border-2 border-emerald-500 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition";
      box.innerHTML = `
        <i class="fa-solid fa-image text-emerald-400 text-lg"></i>
        <div class="text-left">
          <p class="text-xs font-bold text-white">Foto_evidencia_caja_01.jpg</p>
          <p class="text-[10px] text-emerald-300">Geomarca: -34.5830, -58.4312 • 08:24 hs</p>
        </div>
      `;
      showToast("Foto tomada en vivo con metadatos GPS incrustados. Cumple RF-05.", "info");
    }

    function submitIncidentTicket() {
      showToast("Incidencia registrada con éxito. La penalización salarial automática queda SUSPENDIDA hasta la auditoría de Administración.", "warning");
      cancelIncidentForm();
    }

    // Startup Execution
    window.onload = function() {
      initChart();
      initSignaturePad();
    };
