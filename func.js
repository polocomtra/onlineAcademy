function getCategory()
{
    var myParent = document.body;
    console.log('Hello World');
    //Create array of options to be added
    var array = ["Volvo","Saab","Mercades","Audi"];
    //Create and append select list
    selectList = document.getElementById("categories_dropdown");
    //Create and append the options
    for (var i = 0; i < array.length; i++) 
    {
        var option = document.createElement("a");
        option.value = array[i];
        option.text = array[i];
        option.className = 'dropdown-item';
        option.id = 'dropdown'+ i;
        option.href = 'logos';
        selectList.appendChild(option);
    }
}

function sayHello() {
    alert("Hello World!")
  }

    