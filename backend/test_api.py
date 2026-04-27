import requests
import json

BASE_URL = "http://localhost:5000/api"

# Colores para output
GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'

class APITester:
    def __init__(self):
        self.token = None
        self.student_token = None
        self.user_data = None
    
    def print_result(self, test_name, success, response):
        status = f"{GREEN}✓{RESET}" if success else f"{RED}✗{RESET}"
        print(f"{status} {test_name}")
        if not success:
            print(f"  {response}")
    
    def test_signup(self):
        print(f"\n{BLUE}=== TESTING SIGNUP ==={RESET}")
        
        data = {
            "email": "test_prof@escuela.com",
            "nombre": "Test",
            "apellido": "Profesor",
            "contraseña": "TestPass123",
            "rol": "teacher"
        }
        
        response = requests.post(f"{BASE_URL}/auth/signup", json=data)
        success = response.status_code == 201
        
        self.print_result("Signup como profesor", success, response.text)
        
        if success:
            self.token = response.json()['access_token']
        
        # Test signup como estudiante
        data['email'] = "test_stud@escuela.com"
        data['rol'] = "student"
        response = requests.post(f"{BASE_URL}/auth/signup", json=data)
        success = response.status_code == 201
        
        self.print_result("Signup como estudiante", success, response.text)
        
        if success:
            self.student_token = response.json()['access_token']
    
    def test_login(self):
        print(f"\n{BLUE}=== TESTING LOGIN ==={RESET}")
        
        data = {
            "email": "test_prof@escuela.com",
            "contraseña": "TestPass123"
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=data)
        success = response.status_code == 200
        
        self.print_result("Login correcto", success, response.text)
        
        # Test login con contraseña incorrecta
        data['contraseña'] = "WrongPassword"
        response = requests.post(f"{BASE_URL}/auth/login", json=data)
        success = response.status_code == 401
        
        self.print_result("Login con contraseña incorrecta (esperado fallo)", success, response.text)
    
    def test_get_profile(self):
        print(f"\n{BLUE}=== TESTING GET PROFILE ==={RESET}")
        
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        success = response.status_code == 200
        
        self.print_result("Obtener perfil con token", success, response.text)
        
        # Sin token
        response = requests.get(f"{BASE_URL}/auth/me")
        success = response.status_code == 401
        
        self.print_result("Obtener perfil sin token (esperado fallo)", success, response.text)
    
    def test_get_courses(self):
        print(f"\n{BLUE}=== TESTING GET COURSES ==={RESET}")
        
        response = requests.get(f"{BASE_URL}/cursos")
        success = response.status_code == 200
        
        self.print_result("Obtener lista de cursos", success, response.text)
        
        if success:
            courses = response.json()['cursos']
            print(f"  Cursos disponibles: {len(courses)}")
    
    def test_student_inscription(self):
        print(f"\n{BLUE}=== TESTING STUDENT INSCRIPTION ==={RESET}")
        
        # Obtener primer curso
        response = requests.get(f"{BASE_URL}/cursos")
        if response.status_code != 200 or len(response.json()['cursos']) == 0:
            print(f"{RED}✗ No hay cursos disponibles{RESET}")
            return
        
        curso_id = response.json()['cursos'][0]['id']
        
        headers = {"Authorization": f"Bearer {self.student_token}"}
        response = requests.post(f"{BASE_URL}/estudiante/inscribirse/{curso_id}", headers=headers)
        success = response.status_code == 201
        
        self.print_result("Inscribirse a curso", success, response.text)
    
    def test_student_courses(self):
        print(f"\n{BLUE}=== TESTING STUDENT COURSES ==={RESET}")
        
        headers = {"Authorization": f"Bearer {self.student_token}"}
        response = requests.get(f"{BASE_URL}/estudiante/cursos", headers=headers)
        success = response.status_code == 200
        
        self.print_result("Obtener mis cursos", success, response.text)
        
        if success:
            cursos = response.json()['cursos']
            print(f"  Cursos inscritos: {len(cursos)}")
    
    def test_student_profile(self):
        print(f"\n{BLUE}=== TESTING STUDENT PROFILE ==={RESET}")
        
        headers = {"Authorization": f"Bearer {self.student_token}"}
        response = requests.get(f"{BASE_URL}/estudiante/perfil", headers=headers)
        success = response.status_code == 200
        
        self.print_result("Obtener perfil de estudiante", success, response.text)
    
    def test_teacher_proposals(self):
        print(f"\n{BLUE}=== TESTING TEACHER PROPOSALS ==={RESET}")
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Obtener propuestas
        response = requests.get(f"{BASE_URL}/profesor/propuestas", headers=headers)
        success = response.status_code == 200
        
        self.print_result("Obtener mis propuestas", success, response.text)
        
        # Crear propuesta
        data = {
            "nombre": "Test Curso Propuesto",
            "descripcion": "Descripción del test",
            "duracion_horas": 20,
            "categoria": "Tecnología",
            "nivel": "Intermedio",
            "requisitos": "Ninguno",
            "objetivos": "Aprender",
            "metodologia": "Clases"
        }
        
        response = requests.post(f"{BASE_URL}/profesor/propuestas", json=data, headers=headers)
        success = response.status_code == 201
        
        self.print_result("Crear propuesta de curso", success, response.text)
    
    def test_statistics(self):
        print(f"\n{BLUE}=== TESTING STATISTICS ==={RESET}")
        
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(f"{BASE_URL}/estadisticas/propuestas", headers=headers)
        success = response.status_code == 200
        
        self.print_result("Obtener estadísticas de propuestas", success, response.text)
        
        headers = {"Authorization": f"Bearer {self.student_token}"}
        response = requests.get(f"{BASE_URL}/estadisticas/estudiante", headers=headers)
        success = response.status_code == 200
        
        self.print_result("Obtener estadísticas de estudiante", success, response.text)
    
    def test_health(self):
        print(f"\n{BLUE}=== TESTING HEALTH ==={RESET}")
        
        response = requests.get(f"{BASE_URL}/health")
        success = response.status_code == 200
        
        self.print_result("Health check", success, response.text)
    
    def run_all_tests(self):
        print(f"\n{GREEN}{'='*50}{RESET}")
        print(f"{GREEN}PRUEBAS DE API - Escuela de Emprendimiento{RESET}")
        print(f"{GREEN}{'='*50}{RESET}")
        
        try:
            self.test_health()
            self.test_signup()
            self.test_login()
            self.test_get_profile()
            self.test_get_courses()
            self.test_student_profile()
            self.test_student_inscription()
            self.test_student_courses()
            self.test_teacher_proposals()
            self.test_statistics()
            
            print(f"\n{GREEN}{'='*50}{RESET}")
            print(f"{GREEN}✅ PRUEBAS COMPLETADAS{RESET}")
            print(f"{GREEN}{'='*50}{RESET}")
        
        except Exception as e:
            print(f"\n{RED}❌ ERROR: {str(e)}{RESET}")

if __name__ == "__main__":
    tester = APITester()
    tester.run_all_tests()
