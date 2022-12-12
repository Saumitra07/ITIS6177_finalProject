# ITIS6177_finalProject- VisionAPI- Azure Computer vision- Optical Character recognition.

VisionAPI is the application which helps to get text from image using Azure computer vision APIs.
Application is developed using express js and has been hosted on Digital Ocean. 

Application URL is http://137.184.200.94:3000/


How to test application using Postman

1)	Copy the url of the application http://137.184.200.94:3000/ in Postman. Select the post request. In body, select x-www-form-urlencoded, add image as key and in value – image url can be copied. Click on send.
2)	If Image is supported, you will see 200 response. You can get the ID which will required for GET request in ‘action’ inside form in response body.
3)	Change the request type to GET and copy the ID in http://137.184.200.94:3000/:id 
for ex: http://137.184.200.94:3000/a4db8bf6-8fe5-4b3e-8c2f-08a6e2382977

4)	If the response is 200, you will be able to see the lines in the response body.

How to test application using UI


1)	Go the Browser. Enter the URL http://137.184.200.94:3000/
 

2)	Enter the url in text box. Click on Submit button. Ex- https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/printed_text.jpg

3)	Click on Extract Text button. Result will be in the form of lines from image

4)	Below are the few example Image links which works.

	https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/printed_text.jpg

	https://cdn.europosters.eu/image/750/posters/rocky-main-poster-i119986.jpg

	https://onlinetexttools.com/images/examples-onlinetexttools/letter-to-santa-claus.png

	https://www.digitalprinting.co.uk/media/images/products/slides/2/business-cards-1.jpg

	https://www.shutterstock.com/image-photo/spices-on-white-background-sample-600w-77466610.jpg

Below are the few example Image links which doesn’t work due to bad format/size issues.
    https://www.researchgate.net/profile/Neeta-Nain/publication/299666231/figure/fig1/AS:491693964304386@1494240384780/Example-image-of-a-general-handwritten-text-paragraph-from-IAM-dataset-4.png


		 	
How to run the application

    1) Clone the repository https://github.com/Saumitra07/ITIS6177_finalProject.git

    2) Create Azure account and subscribe for azure computer vision API to get the subscription key.

    3) Create .env file and copy your subscription key in that file.

    4) run - npm install

    5) run - node app.js
 





