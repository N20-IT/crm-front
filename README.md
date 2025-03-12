# **N20 CRM - real estate agency CRM**

Modern CRM system for real estate agencies containing basic functionalities in the agent-client relationship.

## **Table of Contents**

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Deployment](#deployment)
5. [Screenshots](#screenshots)
6. [System Requirements](#system-requirements)
7. [Installation and Setup](#installation-and-setup)
8. [Contributors](#contributors)

## **Project Overview**

This modern CRM system for a real estate agency streamlines the agent-client relationship by providing essential functionalities. The application is built using Node.js and React, leveraging AWS cloud services for scalability and reliability.

## **Features**

- **Property Listings & Client Management** – A structured database with tables for property listings and client records.  
- **Admin Panel** – A dedicated interface for administrators to manage real estate agents.  
- **Automation & Integrations** – Automated processes for sending SMS and emails, as well as system logs, backups, and CI/CD pipelines for seamless deployment.  

## **Technologies Used**

- **Frontend:** [React](https://react.dev/)  
- **Backend:** [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)  
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)  
- **Animations:** [AOS (Animate on Scroll)](https://michalsnik.github.io/aos/)  
- **Fonts:** [Google Fonts](https://fonts.google.com/)  
- **Hosting:** [AWS EC2](https://aws.amazon.com/ec2/), [AWS Amplify](https://aws.amazon.com/amplify/)  
- **Cloud Services:** [AWS Lambda](https://aws.amazon.com/lambda/), [AWS Cognito](https://aws.amazon.com/cognito/), [AWS IAM](https://aws.amazon.com/iam/), [AWS API Gateway](https://aws.amazon.com/api-gateway/)  

## Deployment

The website is deployed and hosted using AWS Amplify.
Backend services are hosted on AWS EC2 VPS with Amazon Linux installed.

## **Screenshots**

### Login page

![image](https://github.com/user-attachments/assets/ab674f41-5233-47c9-86b9-fdb0982f0bb2)


## Listings/Clients

![image](https://github.com/user-attachments/assets/1b27f454-1256-4384-8bbb-8222c903f7fe)


## Admin panel

![image](https://github.com/user-attachments/assets/d459bcc2-7329-427b-aae7-dade07514583)


## **System Requirements**

### Frontend
- Node.js version 14.x or newer.
- npm or yarn package manager.
### Backend
- Docker
- Backend services image

## **Installation and Setup**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/N20-IT/crm-front.git
   cd your-repo-name
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the project locally**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Run backend image using Docker**:  
   To get access to backend image sample please contact with **Damian Kaniewski** [GitHub](https://github.com/damiankaniewski)
   
6. **Open the application in your browser**:  
   The application will be available at [http://localhost:3020](http://localhost:3020).

## **Contributors**

- **Rafał Ciupek**: [GitHub](https://github.com/ruffaaw) - Frontend Developer, UX/UI Designer
- **Damian Kaniewski**: [GitHub](https://github.com/damiankaniewski) - Software Developer, Project Manager
- **Jakub Szostak**: [GitHub](https://github.com/jszostakk) - DevOps, Automation Lead
- **Maciej Krzyszkowski**: [LinkedIn](https://www.linkedin.com/in/maciej-krzyszkowski-1778ba259/) - DevOps, Automation Lead


This project was developed under the company [Policrafts](https://www.linkedin.com/company/policrafts/) .
All rights reserved. This project is legally owned by **Policrafts** and is governed by the terms and conditions of the company's policies.
