import csv
import os
import requests
from urllib.parse import urlparse

csv_file_path = 'new-members.csv'

# def download_image(url, directory):
#     response = requests.get(url)
#     if response.status_code == 200:
#         # Extract filename from URL
#         filename = 'avatar.jpg'
#         filepath = os.path.join(directory, filename)
#         with open(filepath, 'wb') as file:
#             file.write(response.content)
#         return filename
#     return None

def process_csv(csv_file):
    encoding = 'iso-8859-1'
    with open(csv_file, 'r', newline='', encoding=encoding) as file:

        csv_reader = csv.DictReader(file)
        
        for row in csv_reader:
    
            fname = row.get('First Name', '')
            lname = row.get('Last Name', '')
            username = row.get('Username', '')
            branch = row.get('Branch', '')
            sbio = row.get('Short Bio', '')
            lbio = row.get('Long Bio', '')
            interests = row.get('Research Interests', '').split(", ")
            email = row.get('Email1', '')
            github = row.get('Github Profile (Link)', '')
            category = row.get('Category', '')
            advisor = row.get('Advisor', '')
            # pfp = row.get('Profile Picture (Accessible URL)', '')

            directory = username
            os.makedirs(directory, exist_ok=True)
            
            md_filename = os.path.join(directory, f"_index.md")
            with open(md_filename, 'w') as md_file:
                md_file.write(f"---\ntitle: {fname} {lname}\n\n")
                md_file.write(f"# Full name (for SEO)\nfirst_name: {fname}\nlast_name: {lname}\n\n")
                md_file.write(f"# Username (this should match the folder name)\nauthors:\n  - {username}\n\n")
                md_file.write(f"superuser: false\n\n")
                md_file.write(f"# Role/position\nrole: {branch}\n\n")
                md_file.write(f"# Organizations/Affiliations\norganizations:\n  - name: IIIT Hyderabad\n    url: ''\n\n")
                md_file.write(f"# Short bio (displayed in user profile at end of posts)\nbio: {sbio}\n\n")
                md_file.write(f"interests:\n")
                for item in interests:
                    md_file.write(f"  - {item}\n")
                md_file.write(f"\n")
                md_file.write(f"# Social/Academic Networking\nsocial:\n  - icon: envelope\n    icon_pack: fas\n    link: 'mailto:{email}'\n  - icon: github\n    icon_pack: fab\n    link: '{github}'\n\n")
                md_file.write(f"user_groups:\n  - {category}\n\n")
                md_file.write(f"# Advisor\nadvisor: \"{advisor}\"\n\n")
                md_file.write(f"---\n{lbio}\n\n")

            # download_image(pfp,username)

process_csv(csv_file_path)