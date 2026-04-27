'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';

interface FAQ {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    pregunta: '¿Cómo me inscribo en un curso?',
    respuesta: 'Para inscribirte en un curso, ve a tu dashboard de estudiante, encuentra el curso que te interesa y haz clic en el botón "Inscribirse". Una vez confirmado, el curso aparecerá en tu lista de cursos inscritos.',
    categoria: 'Inscripciones'
  },
  {
    id: '2',
    pregunta: '¿Puedo cancelar mi inscripción en un curso?',
    respuesta: 'Sí, puedes cancelar tu inscripción en cualquier momento desde tu dashboard. Dirígete a "Mis Cursos" y selecciona la opción de cancelar inscripción. Ten en cuenta que esta acción es irreversible.',
    categoria: 'Inscripciones'
  },
  {
    id: '3',
    pregunta: '¿Qué cursos hay disponibles?',
    respuesta: 'Los cursos disponibles se muestran en tu dashboard principal. Solo ves cursos que han sido aprobados por el administrador. Los cursos muestran información como el profesor, duración y descripción.',
    categoria: 'Cursos'
  },
  {
    id: '4',
    pregunta: '¿Cuántos cursos puedo tomar simultáneamente?',
    respuesta: 'No hay un límite establecido. Puedes inscribirte en tantos cursos como desees y estudiar al ritmo que prefieras.',
    categoria: 'Cursos'
  },
  {
    id: '5',
    pregunta: '¿Cómo veo mi progreso en los cursos?',
    respuesta: 'Tu lista de cursos inscritos se muestra en la sección "Mis Cursos". Allí puedes ver todos los cursos en los que estás matriculado actualmente.',
    categoria: 'Progreso'
  },
  {
    id: '6',
    pregunta: '¿Qué hago si olvido mi contraseña?',
    respuesta: 'Si olvidas tu contraseña, puedes usar la opción "¿Olvidaste tu contraseña?" en la página de login. Recibirás instrucciones para restablecerla. Si no funciona, contacta al administrador.',
    categoria: 'Cuenta'
  },
  {
    id: '7',
    pregunta: '¿Puedo cambiar mis datos personales?',
    respuesta: 'Tu información de perfil (nombre, email) se muestra en el dashboard. Para cambiarla, debes contactar al administrador del sistema que podrá actualizar tus datos.',
    categoria: 'Cuenta'
  },
  {
    id: '8',
    pregunta: '¿Cómo sé cuándo un nuevo curso está disponible?',
    respuesta: 'Los nuevos cursos aparecen automáticamente en tu dashboard cuando el administrador los aprueba. Puedes revisar tu lista de cursos disponibles en cualquier momento.',
    categoria: 'Cursos'
  },
  {
    id: '9',
    pregunta: '¿Hay certificados al completar un curso?',
    respuesta: 'El sistema está en desarrollo. En futuras versiones, habrá un sistema de certificados para los estudiantes que completen sus cursos satisfactoriamente.',
    categoria: 'Certificados'
  },
  {
    id: '10',
    pregunta: '¿A quién contacto si tengo problemas técnicos?',
    respuesta: 'Si experimentas problemas técnicos, puedes contactar al administrador del sistema. El equipo de soporte revisará tu caso y te ayudará a resolverlo lo antes posible.',
    categoria: 'Soporte'
  }
];

export function ChatbotFAQ() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = FAQS.filter(faq =>
    faq.pregunta.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.respuesta.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all z-50"
        aria-label="Abrir chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Panel del chatbot */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 max-h-96 shadow-xl z-50 flex flex-col bg-white">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="font-bold text-lg">Preguntas Frecuentes</h3>
            <p className="text-sm text-blue-100">¿En qué podemos ayudarte?</p>
          </div>

          {!selectedFAQ ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Búsqueda */}
              <div className="p-4 border-b">
                <input
                  type="text"
                  placeholder="Busca una pregunta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lista de FAQs */}
              <div className="overflow-y-auto flex-1 p-4 space-y-2">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map(faq => (
                    <button
                      key={faq.id}
                      onClick={() => setSelectedFAQ(faq)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-200"
                    >
                      <p className="font-medium text-gray-900">{faq.pregunta}</p>
                      <p className="text-xs text-gray-500 mt-1">{faq.categoria}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-4">No encontramos preguntas relacionadas</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Botón atrás */}
              <button
                onClick={() => setSelectedFAQ(null)}
                className="p-3 text-left text-blue-600 hover:bg-gray-50 border-b text-sm font-medium"
              >
                ← Volver a preguntas
              </button>

              {/* Respuesta */}
              <div className="overflow-y-auto flex-1 p-4">
                <h4 className="font-bold text-gray-900 mb-3">{selectedFAQ.pregunta}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedFAQ.respuesta}</p>
                <p className="text-xs text-gray-500 mt-4">Categoría: {selectedFAQ.categoria}</p>
              </div>

              {/* Pie */}
              <div className="p-4 border-t bg-gray-50">
                <p className="text-xs text-gray-600 text-center">¿Necesitas más ayuda? Contacta al administrador</p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
