let heading=document.getElementById("heading");//getting the heading element
let selectContainer=document.getElementById("select-container");//getting the select container
let imagesContainer=document.getElementById("images-container");//getting the images container
let roverList=document.getElementById("rover-list");//getting the rover list
let sol=document.getElementById("sol");//getting the sol element
let getImages=document.getElementById("get-images");//getting the get images button
let page=document.getElementById("page");//getting the page element
let prevBtn=document.getElementById("prev-btn");//getting the previous button
let pageNumber=document.getElementById("page-number");//getting the page number element
let nextBtn=document.getElementById("next-btn");//getting the next button
let goBtn=document.getElementById("go");//getting the go element
let hideBtn=document.getElementById("hide-btn");//getting the hide button

let countHide=0;//count of times the hide button is clicked

let imagesArr=null;//images array containing the images show on the page
let numImages=0;//number of images which are shown on the page
let pageNum=1;//page number whose images are to be shown and is 1 by default

let canClick=true;//can click indicates whether we can click a button(getImages, prev, next) or not and this is added so that time and space are not wasted for sols and pages which do not exist

function setImages(imagesArr){//function for setting the images        

    let count=0;

    while(count<numImages){//iterating on all the images to be shown on the page

        let imageUrl=imagesArr[count]["img_src"];//getting the url of a particular image
        let image=document.createElement("img");//creating an image element

        image.setAttribute("src", imageUrl);//setting the src and alt attributes of the image
        image.setAttribute("alt", "a photo taken by the mars rover");            

        imagesContainer.appendChild(image);//appending the image as a child of the images container 

        count++;

    }  

    canClick=true;//once the images have been set, the user can click getImages, prev or next button again

}

function makeRequest(){//function for making the xml http request to get the images

    while(imagesContainer.lastChild){//removing all the images inside the images container 
        imagesContainer.removeChild(imagesContainer.lastChild);
    }

    let rover=roverList.selectedOptions[0].value;//getting the rover selected
    let solVal=sol.value;//getting the sol input 
    
    let xhrRequest=new XMLHttpRequest();//making a new xml http request object

    xhrRequest.open("get", "https://api.nasa.gov/mars-photos/api/v1/rovers/"+rover+"/photos?sol="+solVal+"&page="+pageNum+"&api_key=js5LmdWADgrqOu6kcF2oqW7a1i8r8Xzi43SYpPEr", true);//initializing the request, where the method is "get", nasa api is used for getting the images wrt the rover, sol and page value and true indicates that we're making an asynchronous request(default)

    xhrRequest.send();//sending the request to the server

    xhrRequest.onload=function(){//function to handle the case when we have recieved the reponse

        let jsonResponse=JSON.parse(xhrRequest.response);//parsing the reponse to a json object        
        imagesArr=jsonResponse["photos"];//defining the images array
        
        numImages=imagesArr.length;//setting the number of images

        if(numImages==0){//if the number of images are 0    
                    
            if(pageNum==1){//if page number is 1, then it means that no images were taken by the selected rover on the the provided day, so we display an alert message, reload the page and return

                alert(rover+" didn't take any images on sol : "+solVal+", resetting the fields");                

                document.location.reload();                
                return ;                

            }      
            else{//this is the case when the page does not exist, so we display an alert message, reset pageNum to 1, make a request to show the first page of the selected rover and return

                alert("Page does not exist, taking you back to the first page");            
            
                pageNum=1;
                makeRequest(true);            
                return ;

            }
            
    
        }
        else{//if the number of images are non zero
        
            pageNumber.innerText=pageNum;//set the inner text of the page number element
            setImages(imagesArr);//setting the images 

        }

    }

    xhrRequest.onerror=function(){//function to handle the case when we have an error while getting the response from the server

        console.log("Error while fetching the resource");//we print a relevant error message and simply return
        return ;

    }

}

window.addEventListener("load", function(){//handling the event when the window object is loaded

    heading.classList.add("animate__animated", "animate__lightSpeedInLeft");//add light speed in left animation to the heading 

    pageNum=1;//set page number to 1 and make a request to the server to get the images
    makeRequest();

});

function buttonPressed(button, animation){//adding animation to the pressed button
                             
    button.classList.add("animate__animated", "animate__"+animation+"");//add the provided animation to the button

    button.addEventListener("animationend", function(){//removing the animation from the button, once it has ended
        button.classList.remove("animate__animated", "animate__"+animation+"");
    });        

}

getImages.addEventListener("click", function(){//handling the event when the get images button is clicked

    // there is no need to add the can click check here as there will be no case when we cannot click the getImages button
    
    canClick=false;//we cannot click getImages, prev or next button till can click becomes true again i.e. after the images are set

    if(sol.value==""){//if no sol value is provided, then we display an alert message and return 

        alert("Enter a sol value");
        return ;

    }
    
    if(sol.value<=0 || sol.value>=1001){//if an invalid sol value is provided, then we display an alert message and return 
        
        alert("Enter a valid sol value");
        return ;

    }

    buttonPressed(getImages, "zoomIn");//adding zoomIn animation to the getImages button

    pageNum=1;//setting page number to 1 and make a request to the server to get the images
    makeRequest();

});

goBtn.addEventListener("click", function(){//handling the event when the go button is clicked       
    
    if(page.value==""){//if no page value is provided, then we display an alert message and return 

        alert("Enter a page number");
        return ;

    }

    if(page.value<=0){//if an invalid page value is provided, then we display an alert message and return 

        alert("Page does not exist, enter a valid page number");
        return ;

    }

    buttonPressed(goBtn, "zoomIn");//adding zoomIn animation to the go button

    pageNum=page.value;//setting page number to the page provided and make a request to the server to get the images    
    makeRequest();

});

function leftPressed(){//handle the event when the left button is pressed    

    if(!canClick){//returning if we cannot click the button
        return ;
    }

    canClick=false;//setting can click to false, to make sure that a button(getImages, prev or next) canot be pressed till the images are set

    pageNum--;//moving towards the left

    if(pageNum==0){//we display an alert message when the page number is invalid, reset it to 1 and return

        alert("Page does not exist");

        pageNum=1;
        return ;

    }    

    buttonPressed(prevBtn, "flash");//adding flash animation to the prev button and make a request to the server to get the images
    makeRequest(); 

}

function rightPressed(){//handle the even when the right button is pressed

    if(!canClick){//returning if we cannot click the button
        return ;
    }

    canClick=false;//setting can click to false, to make sure that a button(getImages, prev or next) canot be pressed till the images are set

    buttonPressed(nextBtn, "flash");//adding flash animation to the next button 

    pageNum++;//moving towards the right and we make a request to the server to get the images
    makeRequest();

}

prevBtn.addEventListener("click", leftPressed);//handling the event when the prev button is pressed
nextBtn.addEventListener("click", rightPressed);//handling the event when the next button is pressed

document.addEventListener("keydown", function(event){//handling the event when a key is pressed down

    if(sol==document.activeElement || page==document.activeElement){//to make sure that the page does not change when we are setting the input fields

        return ;
        
    }

    let keyCode=event.key;//getting the key code  

    if(keyCode=="a" || keyCode=="A" || keyCode=="ArrowLeft"){//calling left pressed function if the key is a valid key to move towards the left

        leftPressed();

    }
    if(keyCode=="d" || keyCode=="D" || keyCode=="ArrowRight"){//calling right pressed function if the key is a valid key to move towards the right

        rightPressed();

    }

});

hideBtn.addEventListener("click", function(){//handling the event when the hide button is pressed
    
    if(countHide%2==0){//if countHide is even

        selectContainer.style.display="none";//hiding the select container and set the content of hide button to show

        hideBtn.innerText="show";

    }   
    else{//if countHide is odd

        selectContainer.removeAttribute("style");//removing the style attribute of the select container and set the content of hide button to hide

        hideBtn.innerText="hide"

    }

    countHide++;//incrementing countHide

});