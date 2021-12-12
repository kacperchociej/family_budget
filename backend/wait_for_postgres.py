import socket
import time

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
attempts = 30
connected = False

for i in range(1, attempts + 1):
    try:
        s.connect(('postgres', 5432))
        s.close()
        connected = True
        break
    except socket.error as ex:  # noqa
        time.sleep(1)
        print(f'Attempt [{i}/{attempts}]')

if not connected:
    raise ConnectionError('Cannot connect with postgres service. Closing...')
