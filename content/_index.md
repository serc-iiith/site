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
  
  - block: markdown
    content:
      title:
      subtitle: ''
      text:
    design:
      columns: '1'
      background:
        image: 
          filename: rnd.jpeg
          filters:
            brightness: 0.7
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
        {{% cta cta_link="./people/" cta_text="Meet the team →" %}}
    design:
      columns: '1'
---
