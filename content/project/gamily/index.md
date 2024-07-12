---
title: Gamily - Gamification Platform For All
authors: []
categories: ['completed']
date: 2024-07-10
# image:
#   focal_point: 'top'
---

Gamification of software engineering activities to increase interest in developers.

Demo: [YouTube Link](https://www.youtube.com/watch?v=IjgOBEQMFn8)

<!--more-->

Software engineering activities like code reviews, change management, knowledge management, issue tracking, etc. tend to be heavily process oriented. Gamification of such activities by composing the core activities with game design elements like badges and points can increase developers' interest in performing such activities. While there are various frameworks/applications that assist in gamification, extending the frameworks to add any/all desired game de sign elements have not been adequately addressed.

As part of our research, we designed and developed an extensible architectural framework for gamification of software engineering activities where in the game design elements are modeled as services. We create an example instance of our framework by building a prototype for code review activity and note the challenges of designing such an extensible architectural framework. The example instance uses python's Flask micro framework and has five game design elements implemented as services, and exposed using restful APIs.
