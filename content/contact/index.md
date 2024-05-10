---
title: Contact
date: 2022-10-24

type: landing

sections:
  - block: contact
    content:
      title: Contact Us
      text: |-
        If you have any queries or enquires, do send us a message!
      email: serc@iiit.ac.in
      # phone: 888 888 88 88
      address:
        street: IIIT Hyderabad Campus, Prof. C R Rao Road
        city: Hyderabad
        region: Telangana
        postcode: '500032'
        country: India
        country_code: IN
      coordinates:
        latitude: '17.445730897500702'
        longitude: '78.34885403286968'
      directions: Enter Himalaya Block D, and use the elevator to get to the 5th floor.
      office_hours:
        - 'Monday - Saturday, 09:00 to 17:00'
      # appointment_url: 'https://calendly.com'
      #contact_links:
      #  - icon: comments
      #    icon_pack: fas
      #    name: Discuss on Forum
      #    link: 'https://discourse.gohugo.io'
    
      # Automatically link email and phone or display as text?
      autolink: true
    
      # Email form provider
      form:
        provider: netlify
        formspree:
          id:
        netlify:
          # Enable CAPTCHA challenge to reduce spam?
          captcha: false
    design:
      columns: '1'

  - block: markdown
    content:
      title:
      subtitle: ''
      text:
    design:
      columns: '1'
      background:
        image: 
          filename: contact.jpg
          filters:
            brightness: 1
          parallax: false
          position: center
          size: cover
          text_color_light: true
      spacing:
        padding: ['20px', '0', '20px', '0']
      css_class: fullscreen
---
