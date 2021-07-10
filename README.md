<h1>Table Sort</h1>
<h2>Description</h2>
A Javascript class, that allows you to sort an HTML table by clicking the column header that is assigned the sorting functionality.

<h2>How To Use</h2>

If you are not goint to make improvements or changes to the code you will need to delete the .git directory

Open the file where your table is and place the script tag right after the line of the closing table tag.
<script src="TableSort/dist/SortTable.js"></script>

First, make sure you have the same count of <th> tags as <td> tags. If you have a hidden or just an extra <td>, make sure you add the data- attribute to it like the following data-hiddenfromsort="true" to not throw off the sorting.

Make sure to add the data- attribute data-datatype and an id to the <th> tags. Example below:
<th id="myId" data-datatype="number">123</th>

There are 4 datatypes handled in this class. string, number, date and currency. Setting the data-datatype="" is where these values are placed.

## Developer Notes
Developer: Keith Blackwelder

As of June 9th, 2021 I have gotten to this point of writing the readme.md file. Make sure to add the script tag on the next line after the closing table tag of the table you want to sort. For now, the class only supports one table at a time on a single page. I will be update the class and will be adding the feature to have more than one table on a page at a time being sorted. I will also be writing the advance notes for those who want to contribute to the class. You can also clone and edit as you please.



## Compile to s5 
npx babel src --out-dir dist --presets=@babel/env