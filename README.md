# 3scale Search

This repository can be used as a reference to show a sample code to customize the 3scale's developer portal.

## Pre-requisites

In the following list you can find the required components

 - Openshift 4 or Code Ready Containers
 - 3scale 2.9

## Customization process

Replace or upload the contents of the folders in the following list to the CMS developer portal by executing the steps below:

1. Create a new page with the following parameters:

   - Title: `doc.css`
   - Section: `css`
   - Path: `/css/doc.css`
   - Layout: **Empty**
   - Content Type: `text/css`
   - Contents: [doc.css](Root/css/doc.css)

2. Create a new page with the following parameters:

   - Title: `doc.js`
   - Section: `javascripts`
   - Path: `/javascripts/doc.js`
   - Layout: **Empty**
   - Content Type: `text/javascript`
   - Contents: [doc.js](Root/javascripts/doc.js)

3. Replace the contents of the Layout `Main Layout` with [Main_layout](Layouts/Main_layout.html).

4. Replace the contents of the Documentation page with [Documentation](Root/Documentation.html)

5. Create a new file with the following parameters:

   - Section: `images`
   - Path: `/images/empty-box.png`
   - Attatchment: [empty-box.png](Root/images/empty-box.png)

## Final result 

You should see something like the following picture:

![](doc_files/search_demo_1.gif)

And when you try to go into an API

![](doc_files/search_demo_2.gif)