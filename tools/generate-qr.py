from pathlib import Path
import sys

project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root / '.local-tools' / 'qr'))
import qrcode
import qrcode.image.svg

url = 'https://sin00739.github.io/iniad-port/'
output = project_root / 'qr-code'
output.mkdir(exist_ok=True)
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=32, border=4)
qr.add_data(url)
qr.make(fit=True)
qr.make_image(fill_color='black', back_color='white').save(output / 'iniad-port-qr.png')
qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).save(output / 'iniad-port-qr.svg')
print(f'URL: {url}')
print(f'PNG: {(len(qr.get_matrix()) * 32)} px square; quiet zone: 4 modules')
