# bamazon
Amazon-like application. This app uses node.js  to create a dynamic mysql datbase which creates and manages a storefront.

## Customer Use of Application

1.) open git terminal and navigate to the folder of the app. In the command line enter `node bamazonCustomer.js` . This will populate a table with all of the items available for sale.
![Bamazon Customer items](images/bamazonCustomercommandscreen.png)

2.) the terminal will then prompt the user to enter the `item_id` and `quantity` they wish to order. Once the order is complete a console.log will appear thanking the customer for their order, and give them a total for their order. This will also update the database in the `product_sales` column and `stock_qty` column.
![Bamazon Customer item selection](images/customeritemselection.png)

2a.) the terminal will then prompt the user to enter the `item_id` and `quantity` they wish to order. If the user attempts to order more product than what is in stock a console.log will appear apolgozing for the fact not enough of the product is in stock, and the order will stop and will not complete.
![Bamazon Customer Not Enough In Stock](images/notenough.png)

## Manager Use of Application

1. Open git terminal and navigate to the folder of the app. In the command line enter `node bamazonManager.js` . This will display options that are available for the manager. First select `View Products For Sale` . This will generate a report of all products in the database.
![Bamazon Manager View Products](images/manager_viewproducts.png)

![Bamazon Manager View Low Inventory](images/lowinventory.png)
![Bamazon Customer item selection](images/customeritemselection.png)
![Bamazon Customer item selection](images/customeritemselection.png)
![Bamazon Customer item selection](images/customeritemselection.png)
![Bamazon Customer item selection](images/customeritemselection.png)
