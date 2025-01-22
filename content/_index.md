---
# Leave the homepage title empty to use the site title
title: Software Engineering Research Center
date: 2022-10-24
type: landing

sections:
  - block: hero
    content:
      title: |
        Software Engineering Research Center
      image:
        filename: serc.jpg
      text: |
          Software Engineering Research Center (SERC) aims to research and develop state of art techniques, methods and tools in various areas of software engineering and programming languages. SERC has faculty with vast teaching and research experience in and outside India.
  
  - block: markdown
    content:
      title:
      subtitle: ''
      text:
    design:
      columns: '1'
      background:
        image: 
          filename: serc_members_2025.jpg
          # filters:
          #   brightness: 0.7
          parallax: false
          position: center
          size: cover
          text_color_light: true
      spacing:
        padding: ['20px', '0', '20px', '0']
      css_class: fullscreen
  
  - block: markdown
    content:
      title:
      subtitle:
      text: |
        {{% cta cta_link="./people/" cta_text="Meet The Team →" %}}
    design:
      columns: '1'
  
  - block: collection
    content:
      title: Latest Events
      subtitle:
      text:
      count: 5
      filters:
        author: ''
        category: ''
        exclude_featured: false
        publication_type: ''
        tag: ''
      offset: 0
      order: desc
      page_type: event
    design:
      view: card
      columns: '1'

  - block: contact
    id: social-media
    content:
      title: Social Media
      subtitle: ''
      text: ''
      contact_links:
        - icon: linkedin
          icon_pack: fab
          name: LinkedIn
          link: 'https://www.linkedin.com/company/serciiith/'
        - icon: youtube
          icon_pack: fab
          name: YouTube
          link: 'https://www.youtube.com/@serc-iiith8746'
        - icon: facebook
          icon_pack: fab
          name: Facebook
          link: 'https://www.facebook.com/SERC.IIITH/'
        - icon: twitter
          icon_pack: fab
          name: X (Twitter)
          link: 'https://x.com/SERC_IIITH'
      # Automatically link email and phone or display them just as text?
      autolink: true
    design:
      # Choose how many columns the section has. Valid values: '1' or '2'.
      columns: '2'
---
