# Welcome to FoodRat <br /> The anti food-waste application 

## Resume 
FoodRat allows you to scan a barcode and specify a location (example fridge, or what you want) and put an expiration date on this item. 
If you don't have a barcode, you can enter an item manually. 
After that, You can show all your items or filter by location and see how long your items will last before they are lost.

If you scan a barcode, FoodRat will use the FoodFact API to find the products, so you can scan a cosmetic.

In the future FoodRat will notice you when items are close to their sell-by date 

## Run
To launch the project, you will need to clone it on your computer.

# Prerequisites :
- MongoDB
- Node.js
- React 

# Launch 
For the back you need to create an .env file
```
PORT=BackPort
DB_NAME=FoodRat
DB_HOST=mongodb://X.X.X.X/
```
Where X.X.X.X is the IP address of FoodRat's MongoDB database
You need to add a `SECRET_KEY` for jwt authentication.

For the front you also need an .env file like this : 
```
GENERATE_SOURCEMAP=false
REACT_APP_SERVER_URL=http://X.X.X.X:3000
```
Where X.X.X.X is the IP address of the React server

When you have all the .env files. Run the back and the front separately using command :

> npm run start
