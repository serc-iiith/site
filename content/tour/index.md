---
title: Tour
date: 2022-10-24

type: landing

sections:
  - block: slider
    content:
      slides:
      # - title: 👋 Welcome to Software Engineering Research Center
      - title: Welcome to Software Engineering Research Center
        content: Take a look at what we're working on...
        align: center
        background:
          image:
            filename: serc_center.png
            filters:
              brightness: 0.5
          position: right
          color: '#666'
        link:
          icon: diagram-project
          icon_pack: fas
          text: Projects
          url: ../project/
      - title: Collaborate and Learn ☕️
        content: 'Share your knowledge with the group and explore exciting new topics together!'
        align: left
        background:
          image:
            filename: serc_isec.jpeg
            filters:
              brightness: 0.5
          position: center
          color: '#555'
        link:
          icon: book-bookmark
          icon_pack: fas
          text: Research Areas
          url: ../research/
      - title: World-Class Facilities
        content: 'Talk to know more!'
        align: right
        background:
          image:
            filename: rnd.jpeg
            filters:
              brightness: 0.5
          position: center
          color: '#333'
        link:
          icon: graduation-cap
          icon_pack: fas
          text: Join Us
          url: ../contact/
    design:
      # Slide height is automatic unless you force a specific height (e.g. '400px')
      slide_height: ''
      is_fullscreen: true
      # Automatically transition through slides?
      loop: false
      # Duration of transition between slides (in ms)
      interval: 2000
---
