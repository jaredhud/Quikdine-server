&nbsp;

<div align="center">
<img src="https://github.com/jaredhud/QuikDine-mobile/blob/main/src/img/quik-dine.png?raw=true" alt="QuikDine logo" style="height:80px" />
<br>
Recipe made Easy! - Server Repo
</div>
&nbsp;
<div align="center">
<img src="https://badge.fury.io/js/npm.svg"> <img src="https://img.shields.io/badge/compatible-iOS%20%26%20android-blue" > 
<a href="https://spoonacular.com/food-api"> <img src="https://img.shields.io/badge/API-Spoonacular-orange"> </a>
<a href="https://cloud.google.com/vision/"> <img src="https://img.shields.io/badge/API-Google%20Vision-orange"> </a>
</div>

&nbsp;
<div align="center">
<img src="https://github.com/jaredhud/QuikDine-mobile/blob/main/src/img/architecture.jpg?raw=true" alt="QuikDine logo" style="width:100%">
</div>
<!-- <h1 align="center">QuikDine-mobile</h1> -->

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Eggroll Team Members](#eggroll-team-members)
- [Developer Notes](#developer-notes)
- [Credits](#credits)

## Introduction

Our mobile app allows you to scan items in your pantry and suggest recipes based on the ingredients scanned. Based on the suggestions, you can also vote with your family and friends what you all want for dinner!

This project is divided into 3 parts: mobile, server, and website. This repo, mobile, has the code of our mobile app. The server repo is the one that contacts Spoonacular API. The website repo allows people to vote for people's favorite recipe.

We hope that you have fun and enjoy our app!

## Key Features

    + Item Quikshot - Add items on your pantry through your camera or text.
    + Recipe Finder - suggest recipes based on the items on your pantry.
    + Recipe Selector - Vote for the best recipe for your next meal. The app can add more voting participants.
    + Data Storage - Create an account and store your favorite recipes.
    + Mobile Cross Platform - Works with Android and iOS.

## Installation

1. Install Expo CLI - https://expo.dev
2. Git clone https://github.com/jaredhud/QuikDine-mobile.git
3. Git clone https://github.com/jaredhud/Quikdine-server.git
4. Git clone https://github.com/Kshitija118/QuikDineWebPage.git
5. npm install all the repos above
6. npm run start all the repos above

## Technologies Used

    + Core: React Native - React
    + API: Spoonacular Google Vision API
    + SendGrid Node.js Javascript HTML CSS Javascript Firebase Express.js Expo Go
    + Collaboration: Discord Github Zoom Trello Basecamp Figma

## Eggroll Team Members

- Kshitija Shirsathe - [GitHub](https://github.com/Kshitija118) - [LinkedIn](https://www.linkedin.com/in/kshitija-shirsathe-095a2197/)
- Romell Bermundo - [GitHub](https://github.com/steakncheese) - [LinkedIn](https://www.linkedin.com/in/romellbermundo/)
- Jared Huddleston - [GitHub](https://github.com/jaredhud) - [LinkedIn](https://www.linkedin.com/in/jared-huddleston-715101219/)
- Chris Desmarais - [LinkedIn](https://www.linkedin.com/in/chris-desmarais-543207/) - Scrum Master

## Developer Notes

- Context is used to transfer data from page to page
- Firebase is used to store data
- SendGrid is used for handling email functionality
- Navigation is handled 2 ways: Screen and Tab navigation
- \_RecipeNav and similar folders handles the Tab Navigation part
- Modal is used to create pop-ups (useful for creating help notes)
- When creating page layout, use percentages to divide sections. ie. 10% 10% 30%

## Credits

+ [Node.js](https://nodejs.org/)
+ Base logo vector made by [Freepik](https://www.freepik.com/) from [Flaticon](www.flaticon.com).
