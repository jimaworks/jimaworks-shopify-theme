$(document).ready(function () {
   var galleryCheck = $("div.gallery_pjf").length;
 
   extensions = ["_pico.", "_icon.", "_thumb.", "_small.", "_compact.", "_medium.", "_large.", "_grande.", "_1024x1024.", "_2048x2048." ];

 if (galleryCheck > 0) {
   gallery = $("div.gallery_pjf");
   var images = gallery.find('img');
 
   images.each(function () {
       imgSRC = $(this).attr('src');
       
       for ( var i = 0; i < extensions.length; i++ ){
         var newSRC = imgSRC.replace( extensions[i] ,'.'); 
         if (newSRC.length<imgSRC.length) { break; };
       }
       $(this).wrap('');
   });
 }
    
});