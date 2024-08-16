---
title: Projects
view: compact
type: landing

# Listing view
sections:
  - block: collection
    id: ongoing
    content:
      title: Ongoing
      subtitle: 'Currently ongoing projects at SERC'
      text: 
      # Set count to 0 to view all.
      count: 0
      filters:
      #   folders:
      #     - project
        tag: "ongoing"
      page_type: project
    design:
      view: compact
      columns: '1'

  - block: collection
    id: completed
    content:
      title: Completed
      subtitle: 'Previously completed projects of SERC'
      text: 
      # Set count to 0 to view all.
      count: 4
      filters:
      #   folders:
      #     - project
        tag: "completed"
      page_type: project
    design:
      view: compact
      columns: '1'

# Optional banner image (relative to `assets/media/` folder).
# - banner:
#   caption: ''
#   image: ''
---
