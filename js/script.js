document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    let chatState = {
        flow: null,
        step: 0,
        citaData: {}
    };

    const knowledgeBase = {
        saludos: {
            keywords: ["hola", "buenos dias", "buenas tardes", "saludos", "hey", "que tal"],
            response: "¿Cómo puedo ayudarte hoy?",
            options: ["Información del Centro", "Prevención de Enfermedades", "Solicitar Cita", "Micro-Hábitos"]
        },
        gracias: {
            keywords: ["gracias", "muchas gracias", "agradezco"],
            response: "¡De nada! Estoy para servirte. ¿Hay algo más que necesites?",
            options: ["Sí, otra consulta", "No, eso es todo"]
        },
        no_eso_es_todo: {
            keywords: ["no, eso es todo", "no gracias"],
            response: "Entendido. ¡Que tengas un excelente día y cuida tu salud!"
        },
        adios: {
            keywords: ["adios", "hasta luego", "bye", "nos vemos"],
            response: "¡Hasta pronto! Cuida mucho tu salud. Recuerda visitar el Centro de Salud Nextipac si necesitas algo más."
        },
        info_centro: {
            keywords: ["informacion del centro", "sobre nextipac", "acerca de nextipac", "del centro"],
            response: "Claro, ¿qué información específica del Centro de Salud Nextipac necesitas?",
            options: ["Horarios", "Ubicación", "Teléfono", "Servicios Ofrecidos"]
        },
        horarios: {
            keywords: ["horario", "horarios", "atienden", "abren", "cierran"],
            response: "El Centro de Salud Nextipac atiende de Lunes a Viernes de 8:00 a.m. a 3:00 p.m. para consultas generales y programadas.\nPara urgencias menores fuera de este horario o dudas específicas, te recomendamos llamar."
        },
        ubicacion: {
            keywords: ["ubicacion", "direccion", "donde estan", "llegar", "mapa"],
            response: "Nos encontramos en Deportivo Azteca s/n Nextipac, 45220 Zapopan, Jal., México. Actualmente no puedo mostrarte un mapa aquí, pero puedes buscar la dirección en Google Maps. ¿Algo más?"
        },
        telefono: {
            keywords: ["telefono", "numero", "llamar", "contacto", "llamo"],
            response: "Puedes comunicarte con el Centro de Salud Nextipac al +523336366642."
        },
        servicios: {
            keywords: ["servicios", "ofrecen", "atienden de", "que hacen", "especialidades"],
            response: "En Nextipac ofrecemos una variedad de servicios para tu bienestar:\n- Consulta General\n- Control de Enfermedades Crónicas (Diabetes, Hipertensión)\n- Vacunación (Adultos y Niños)\n- Control Prenatal y Planificación Familiar\n- Curaciones y procedimientos menores\n¿Te interesa conocer más sobre algún servicio en particular?",
            options: ["Control Diabetes", "Control Hipertensión", "Vacunación", "Control Prenatal", "Otro Servicio"]
        },
        prevencion: {
            keywords: ["prevencion", "prevenir enfermedades", "cuidarme", "evitar enfermedad"],
            response: "¡Excelente que te intereses en la prevención! Es la mejor forma de cuidar tu salud. ¿Sobre qué enfermedad o tema te gustaría información preventiva?",
            options: ["Diabetes", "Presión Alta", "Colesterol", "Sobrepeso/Obesidad", "Derrame Cerebral (ECV)", "Dejar de Fumar"]
        },
        diabetes: {
            keywords: ["diabetes", "azucar alta"],
            response: "Para prevenir la diabetes tipo 2, es clave mantener un peso saludable, comer balanceado (muchas verduras, frutas, granos enteros; pocas azúcares y grasas procesadas), y hacer al menos 30 minutos de ejercicio la mayoría de los días. ¿Te gustaría un micro-hábito para empezar hoy mismo relacionado con la alimentación o el ejercicio?",
            options: ["Microhábito Alimentación", "Microhábito Ejercicio", "Chequeo Diabetes"]
        },
        chequeo_diabetes: {
            keywords: ["chequeo diabetes", "prueba azucar"],
            response: "Para saber si tienes riesgo de diabetes o si ya la padeces, es importante hacerte un chequeo que incluya una medición de glucosa en sangre. Puedes solicitar una cita para esto en el Centro de Salud Nextipac."
        },
        presion_alta: {
            keywords: ["presion alta", "hipertension", "presion arterial"],
            response: "Para prevenir la presión alta (hipertensión), te recomiendo: reducir el consumo de sal (menos de 1 cucharadita al día), comer más frutas y verduras, mantener un peso adecuado, hacer actividad física regularmente, evitar el tabaco y el exceso de alcohol, y manejar el estrés. ¿Te gustaría un micro-hábito o más información sobre cómo controlar tu presión?",
            options: ["Microhábito Estrés", "Consejos Dieta HAS", "Medir Presión"]
        },
        medir_presion: {
            keywords: ["medir presion", "checar presion"],
            response: "Es muy importante conocer tus números de presión arterial. En el Centro de Salud Nextipac podemos tomarte la presión y orientarte. Los adultos deberían checarla al menos una vez al año, o más seguido si tienes factores de riesgo."
        },
        colesterol: {
            keywords: ["colesterol", "grasa en sangre", "dislipidemia"],
            response: "Para mantener tu colesterol bajo control: prefiere grasas saludables (aguacate, nueces, aceite de oliva), limita las grasas saturadas y trans (frituras, embutidos, pan dulce), come mucha fibra (frutas, verduras, avena, legumbres) y haz ejercicio. Un chequeo de sangre puede medir tus niveles."
        },
        sobrepeso_obesidad: {
            keywords: ["sobrepeso", "obesidad", "bajar de peso", "gordura"],
            response: "Prevenir el sobrepeso y la obesidad es fundamental para evitar muchas enfermedades. Se logra con una alimentación equilibrada y actividad física constante. Pequeños cambios sostenidos son más efectivos que dietas extremas. ¿Te gustaría un micro-hábito para empezar?",
            options: ["Microhábito Alimentación", "Microhábito Ejercicio"]
        },
        ecv_derrame: {
            keywords: ["ecv", "derrame cerebral", "embolia", "infarto cerebral", "rapido", "síntomas derrame"],
            response: "Un Derrame Cerebral o ECV es una emergencia. Conocer los síntomas RA-PI-DO es vital: R=Rostro caído, A=Alteración del habla, PI=Pérdida de fuerza en brazo/pierna, DO=¡De inmediato llama al 911! No intentes llevar a la persona al hospital tú mismo. Muchos ECV se previenen controlando la presión alta, diabetes y colesterol. En Nextipac tenemos material informativo con un QR para que tengas esto a la mano."
        },
        dejar_fumar: {
            keywords: ["dejar de fumar", "tabaco", "cigarro"],
            response: "¡Dejar de fumar es una de las mejores decisiones para tu salud! Reduce enormemente tu riesgo de enfermedades del corazón, pulmón y ECV. Sabemos que es difícil. En el Centro de Salud Nextipac podemos ofrecerte apoyo y orientación para lograrlo. ¿Te gustaría algunos consejos iniciales?"
        },
        microhabito_general: {
            keywords: ["microhabito", "habito pequeño", "empezar cambio", "pequeño cambio"],
            response: "¡Genial! Los micro-hábitos son pequeños cambios fáciles de incorporar a tu día a día y que suman mucho a largo plazo. ¿En qué área te gustaría un micro-hábito?",
            options: ["Alimentación", "Ejercicio", "Manejo del Estrés"]
        },
        micro_alimentacion: {
            keywords: ["microhabito alimentacion", "comer mejor"],
            response: "Perfecto. Un micro-hábito de alimentación podría ser: 'Hoy, añade una porción de verduras extra a tu comida principal' o 'Reemplaza una bebida azucarada (refresco, jugo procesado) por un vaso de agua simple o agua de frutas natural sin azúcar'. ¿Cuál te gustaría intentar?"
        },
        micro_ejercicio: {
            keywords: ["microhabito ejercicio", "moverme mas"],
            response: "¡Excelente! Para ejercicio, un micro-hábito podría ser: 'Hoy, camina 10-15 minutos a paso ligero' o 'Haz 3 series de 10 sentadillas mientras ves la tele'. Lo importante es empezar y ser constante."
        },
        micro_estres: {
            keywords: ["microhabito estres", "relajarme"],
            response: "Para el estrés, prueba esto: 'Dedica 3-5 minutos a respirar profundamente: inhala lento por la nariz contando hasta 4, sostén el aire contando hasta 4 y exhala lento por la boca contando hasta 6. Repite.' O 'Antes de dormir, anota 3 cosas buenas que te pasaron hoy'."
        },
        solicitar_cita_inicio: {
            keywords: ["cita", "agendar", "consulta", "sacar cita", "ver al doctor"],
            response: "¡Claro! Puedo ayudarte a iniciar tu SOLICITUD de cita. Por favor, ten en cuenta que el personal del Centro de Salud Nextipac se pondrá en contacto contigo para confirmar la disponibilidad.\n¿Para qué servicio es tu solicitud?",
            options: ["Chequeo General", "Control Diabetes", "Control Hipertensión", "Vacunación", "Control Prenatal", "Otro (especificar)"]
        },
        qr_materiales: {
            keywords: ["qr", "codigo qr", "materiales", "folletos", "posters"],
            response: "En el Centro de Salud Nextipac encontrarás pósters y trípticos con información importante sobre prevención. Muchos de ellos tienen un código QR que puedes escanear con tu celular para acceder a más recursos digitales, ¡búscalos en tu próxima visita!"
        },
        default: {
            response: "Entiendo. Para esa consulta específica o si tienes dudas más complejas, te recomiendo contactar directamente al Centro de Salud Nextipac al [Número de Teléfono] o acudir personalmente. ¿Puedo ayudarte con información general sobre nuestros servicios, horarios o cómo prevenir enfermedades comunes?"
        }
    };

    function addMessage(text, sender, options = []) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        if (sender === 'bot-thinking') messageDiv.classList.add('bot-thinking');

        const p = document.createElement('p');
        p.innerHTML = text.replace(/\n/g, '<br>');
        messageDiv.appendChild(p);

        if (options.length > 0 && sender === 'bot') {
            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('chat-options');
            options.forEach(optionText => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = optionText;
                button.addEventListener('click', () => {
                    addMessage(optionText, 'user');
                    processUserInput(optionText);
                });
                optionsDiv.appendChild(button);
            });
            messageDiv.appendChild(optionsDiv);
        }

        const timestamp = document.createElement('span');
        timestamp.classList.add('timestamp');
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.appendChild(timestamp);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBestMatch(userText) {
        const lowerUserText = userText.toLowerCase().trim();
        let bestMatchEntry = null;
        let highestMatchScore = 0;

        for (const entryKey in knowledgeBase) {
            const entry = knowledgeBase[entryKey];
            if (!entry.keywords) continue;

            entry.keywords.forEach(keyword => {
                const keywordParts = keyword.toLowerCase().split(" ");
                let currentScore = 0;
                let allPartsMatchInOrder = true; // Para frases exactas o en orden
                let tempLowerUserText = " " + lowerUserText + " "; // Para buscar palabras completas

                // Chequeo de frase exacta primero (más peso)
                if (tempLowerUserText.includes(" " + keyword.toLowerCase() + " ")) {
                    currentScore = keyword.length * 2; // Mayor peso para frases exactas
                } else {
                    // Chequeo de palabras individuales
                    allPartsMatchInOrder = false; // Ya no es frase exacta
                    keywordParts.forEach(part => {
                        if (tempLowerUserText.includes(" " + part + " ")) {
                            currentScore += part.length;
                        }
                    });
                }
                
                if (allPartsMatchInOrder && keywordParts.length > 1) {
                     currentScore += 20; // Bonus extra por frase en orden
                } else if (keywordParts.every(part => tempLowerUserText.includes(" " + part + " ")) && keywordParts.length > 1){
                    currentScore +=10; // Bonus por todas las palabras presentes, aunque no en orden
                }


                if (currentScore > highestMatchScore) {
                    highestMatchScore = currentScore;
                    bestMatchEntry = entry;
                }
            });
        }
        return bestMatchEntry;
    }


    function processUserInput(userText) {
        let botResponse = knowledgeBase.default.response;
        let responseOptions = [];
        const lowerUserText = userText.toLowerCase().trim();

        if (chatState.flow === 'solicitando_cita') {
            switch (chatState.step) {
                case 1:
                    chatState.citaData.servicio = userText;
                    botResponse = `Entendido, solicitud para "${chatState.citaData.servicio}". ¿Tienes alguna preferencia de día (Lunes a Viernes) o alguna fecha específica en mente para tu solicitud?`;
                    chatState.step = 2;
                    break;
                case 2:
                    chatState.citaData.diaPreferido = userText;
                    botResponse = `Anotado: "${chatState.citaData.diaPreferido}". ¿Y alguna preferencia de turno (mañana o tarde)?`;
                    chatState.step = 3;
                    break;
                case 3:
                    chatState.citaData.turnoPreferido = userText;
                    botResponse = `¡Casi listo!\nServicio: ${chatState.citaData.servicio}\nDía/Fecha: ${chatState.citaData.diaPreferido}\nTurno: ${chatState.citaData.turnoPreferido}\n\nPara completar tu SOLICITUD, por favor proporciona un nombre y un número de teléfono de contacto (Ej: María López - 5512345678). El personal de Nextipac te contactará para confirmar.`;
                    chatState.step = 4;
                    break;
                case 4:
                    chatState.citaData.contacto = userText;
                    console.log("SOLICITUD DE CITA (simulado):", chatState.citaData);
                    botResponse = `¡Gracias, ${chatState.citaData.contacto}! Tu solicitud de cita ha sido registrada. El personal del Centro de Salud Nextipac se comunicará contigo para confirmar los detalles y la disponibilidad. Recuerda, esta es una solicitud, no una cita confirmada.\n¿Puedo ayudarte en algo más?`;
                    responseOptions = knowledgeBase.saludos.options;
                    chatState.flow = null;
                    chatState.step = 0;
                    chatState.citaData = {};
                    break;
            }
            addBotMessageWithThinking(botResponse, responseOptions);
            return;
        }

        const matchedEntry = getBestMatch(userText);
        
        if (matchedEntry) {
            botResponse = matchedEntry.response;
            responseOptions = matchedEntry.options || [];

            if (matchedEntry === knowledgeBase.solicitar_cita_inicio) {
                chatState.flow = 'solicitando_cita';
                chatState.step = 1; 
                chatState.citaData = {};
                // La respuesta ya incluye las opciones de servicio, así que el usuario elegirá.
            } else if (matchedEntry.options && matchedEntry.options.includes(userText) && knowledgeBase[userText.toLowerCase().replace(/ /g, '_')]) {
                // Si el usuario hizo clic en un botón que es una keyword de otra entrada
                const subEntry = knowledgeBase[userText.toLowerCase().replace(/ /g, '_')];
                botResponse = subEntry.response;
                responseOptions = subEntry.options || [];
            }
        }
        
        addBotMessageWithThinking(botResponse, responseOptions);
    }

    function addBotMessageWithThinking(text, options = []) {
        addMessage("...", 'bot-thinking');
        setTimeout(() => {
            const thinkingMessage = chatMessages.querySelector('.bot-thinking');
            if(thinkingMessage) thinkingMessage.remove();
            addMessage(text, 'bot', options);
        }, 600 + Math.random() * 400); // Retraso un poco variable
    }


    function handleSend() {
        const messageText = userInput.value.trim();
        if (messageText) {
            addMessage(messageText, 'user');
            userInput.value = '';
            processUserInput(messageText);
        }
    }

    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Evitar envío con Shift+Enter
            e.preventDefault(); // Prevenir salto de línea en el input si es textarea
            handleSend();
        }
    });

    addMessage(knowledgeBase.saludos.response, 'bot', knowledgeBase.saludos.options);
});