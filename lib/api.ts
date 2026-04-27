const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000/api';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || `Error: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Cursos
  getCursos: async () => {
    const response = await fetch(`${BASE_URL}/cursos`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getCurso: async (cursoId: string) => {
    const response = await fetch(`${BASE_URL}/cursos/${cursoId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Estudiante
  getAvailableCourses: async () => {
    const response = await fetch(`${BASE_URL}/student/available-courses`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  enrollCourse: async (data: { curso_id: number | string }) => {
    const response = await fetch(`${BASE_URL}/student/enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getMyEnrollments: async () => {
    const response = await fetch(`${BASE_URL}/student/my-enrollments`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  inscribirse: async (cursoId: string) => {
    const response = await fetch(`${BASE_URL}/estudiante/inscribirse/${cursoId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getMisCursos: async () => {
    const response = await fetch(`${BASE_URL}/estudiante/cursos`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (data: { nombre: string }) => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateProfileImage: async (formData: FormData) => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData, // Browser sets multipart boundary
    });
    return handleResponse(response);
  },

  // Profesor
  getTeacherCourses: async () => {
    const response = await fetch(`${BASE_URL}/teacher/my-courses`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTeacherCourseStudents: async (cursoId: string | number) => {
    const response = await fetch(`${BASE_URL}/teacher/courses/${cursoId}/students`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getEstadisticas: async () => {
    const response = await fetch(`${BASE_URL}/teacher/estadisticas`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  proponerCurso: async (data: {
    nombre: string;
    descripcion?: string;
    duracion?: string;
    requisitos?: string;
  }) => {
    const response = await fetch(`${BASE_URL}/teacher/proposals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getMisPropuestas: async () => {
    const response = await fetch(`${BASE_URL}/teacher/proposals`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  // Admin
  createCourseAdmin: async (data: { nombre: string; descripcion?: string; duracion?: number; profesor_id: number | string }) => {
    const response = await fetch(`${BASE_URL}/admin/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // ========== ASISTENCIAS ==========
  subirAsistencia: async (formData: FormData) => {
    // Importante: No añadir 'Content-Type' header cuando se envía FormData, fetch lo pone solo con el boundary correcto.
    const headers = getAuthHeaders();
    delete headers['Content-Type']; 

    const response = await fetch(`${BASE_URL}/teacher/asistencias`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    return handleResponse(response);
  },

  getAsistenciasCurso: async (cursoId: number) => {
    const response = await fetch(`${BASE_URL}/teacher/asistencias/${cursoId}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  borrarAsistencia: async (asistenciaId: number) => {
    const response = await fetch(`${BASE_URL}/teacher/asistencias/${asistenciaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  crearUsuarioAdmin: async (data: { nombre: string; email: string; password: string; rol: string }) => {
    const response = await fetch(`${BASE_URL}/admin/create-user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getAdminPropuestas: async () => {
    const response = await fetch(`${BASE_URL}/admin/proposals`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  aprobarPropuesta: async (propuestaId: string) => {
    const response = await fetch(`${BASE_URL}/admin/proposals/${propuestaId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  rechazarPropuesta: async (propuestaId: string) => {
    const response = await fetch(`${BASE_URL}/admin/proposals/${propuestaId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAdminCursos: async () => {
    const response = await fetch(`${BASE_URL}/admin/cursos`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  adminCrearCurso: async (formData: FormData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/admin/courses`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },

  getAdminEstadisticas: async () => {
    const response = await fetch(`${BASE_URL}/admin/estadisticas`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  getAdminUsuarios: async () => {
    const response = await fetch(`${BASE_URL}/admin/usuarios`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  // ========== Votación de Cursos Propuestos ==========

  getPropuestasVotacion: async () => {
    const response = await fetch(`${BASE_URL}/propuestas-votacion`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  votarCurso: async (curso_id: number, tipo: 'interesado' | 'no_interesado' = 'interesado') => {
    const response = await fetch(`${BASE_URL}/votar`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ curso_id, tipo }),
    });
    return handleResponse(response);
  },

  adminGetPropuestasVotacion: async () => {
    const response = await fetch(`${BASE_URL}/admin/propuestas-votacion`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  adminAprobarCursoPropuesto: async (cursoId: number, profesorId?: number) => {
    const response = await fetch(`${BASE_URL}/admin/aprobar-curso-propuesto/${cursoId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: profesorId ? JSON.stringify({ profesor_id: profesorId }) : undefined,
    });
    return handleResponse(response);
  },

  convenioCrearProfesor: async (data: any) => {
    const response = await fetch(`${BASE_URL}/convenio/create-teacher`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  convenioGetMyTeachers: async () => {
    const response = await fetch(`${BASE_URL}/convenio/my-teachers`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  adminCrearPropuestaVotacion: async (data: { titulo: string; descripcion?: string; instructor_tentativo?: string }) => {
    const response = await fetch(`${BASE_URL}/admin/propuestas-votacion`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // ========== Convenio ==========

  convenioCrearPropuesta: async (formData: FormData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/convenio/propuestas`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },

  convenioMisPropuestas: async () => {
    const response = await fetch(`${BASE_URL}/convenio/mis-propuestas`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  convenioEstadisticas: async () => {
    const response = await fetch(`${BASE_URL}/convenio/estadisticas`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  // ========== Certificados ==========

  subirCertificado: async (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${BASE_URL}/admin/certificados`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return handleResponse(response);
  },

  getMisCertificados: async () => {
    const response = await fetch(`${BASE_URL}/student/certificados`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  // ========== EDICIÓN DE CURSOS ==========
  adminEditarCurso: async (cursoId: number, formData: FormData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/admin/cursos/${cursoId}`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },

  convenioEditarPropuesta: async (propuestaId: number, formData: FormData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/convenio/propuestas/${propuestaId}`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },

  // ========== HORARIOS ==========
  getHorarioCurso: async (cursoId: number) => {
    const response = await fetch(`${BASE_URL}/teacher/horario/${cursoId}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  saveHorario: async (formData: FormData) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    const response = await fetch(`${BASE_URL}/teacher/horario`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },
};

