import urllib.request
import json
import urllib.error

base_url = 'http://localhost:5000/api'

def req(method, path, token=None, json_data=None):
    url = base_url + path
    headers = {}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    data = None
    if json_data:
        data = json.dumps(json_data).encode()
        headers['Content-Type'] = 'application/json'
        
    r = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Error {e.code} on {method} {path}: {e.read().decode()}")
        return None

# 1. Login Admin
print("--- Login Admin ---")
admin_login = req('POST', '/auth/login', json_data={'email':'admin@epe.com', 'password':'admin123'})
admin_token = admin_login['token']
print("Admin Token acquired.")

# 2. Check Admin Proposals
print("\n--- Admin Proposals currently ---")
admin_props = req('GET', '/admin/proposals', token=admin_token)
print(json.dumps(admin_props, indent=2))

# 3. Login Teacher
print("\n--- Login Teacher ---")
teacher_login = req('POST', '/auth/login', json_data={'email':'profesor1@escuela.com', 'password':'Password123'})
teacher_token = teacher_login['token']
print("Teacher Token acquired.")

# 4. Teacher proposes a course
print("\n--- Teacher proposes course ---")
prop = req('POST', '/teacher/proposals', token=teacher_token, json_data={
    'nombre': 'Diagnostic Test Course',
    'descripcion': 'Testing visibility',
    'duracion': '2 weeks'
})
print("Proposal created:", prop)

# 5. Check Teacher's own proposals
print("\n--- Teacher Proposals currently ---")
teacher_props = req('GET', '/teacher/proposals', token=teacher_token)
print(json.dumps(teacher_props, indent=2))

# 6. Check Admin Proposals again
print("\n--- Admin Proposals after creation ---")
admin_props2 = req('GET', '/admin/proposals', token=admin_token)
print(json.dumps(admin_props2, indent=2))
