<?php
// get the data from the form
$english = filter_input(INPUT_POST, 'heebie');
$piglatin = "";

//if (empty($english))
//{
//	echo '<script language="javascript">';
//	echo 'alert("Please enter some text to be translated.")';
//	echo '</script>';
//}
//	else 
{
	$english = strtolower($english);
  $english = str_replace('.',' ',$english);
  $english = str_replace('!',' ',$english);
  $english = str_replace('?',' ',$english);
  $english = str_replace(',',' ',$english);
  $english = str_replace(';',' ',$english);
  $english = str_replace(':',' ',$english);
  $words = explode(' ', $english);
		    
  foreach( $words as $value ) 
  { 
    $wordlength = strlen($value);
    $count = 0;
    $newword = "";
      
    for ($i = 0; $i < $wordlength; $i++)
    {
      $char = substr($value,$i,1);
      
      if ($char == "a" || $char == "e" || $char == "i" || $char == "o" || $char == "u")
      {
        $count = $i;
        break;
      };
      
    };  
    
    if ($count == 0)
    {
      $newword = $value."way";
    }
    else  
    {
      $newword = substr($value,$count,($wordlength-$count));
      $newword .= substr($value,0,$count);
      $newword .= "ay";
     };
     if ($newword=="way") $newword="";
     $piglatin .= "$newword ";
 };
};
	  
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Pig Latin Translator</title>
	<meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="pig-style.css">
</head>

<body>
    <main>
    <h1>Pig Latin Translator</h1>
    <form action="index.php" method="post">

   <p>
     
     <label for="heebie">Enter English text:</label><br>
	<?php
    echo'<textarea id="heebie" name="heebie" cols="50" rows="6" placeholder="English text goes here.">'.$english.'</textarea>';
   ?>
      

     </p>  
<p id="button">
    <input type="submit" value="Submit" >
    <p>
      
     
      <label for="jeebie">Pig Latin translation:</label><br>
	<?php
    echo'<textarea id="jeebie" name="heebie" cols="50" rows="6" disabled>'.$piglatin.'</textarea>';
   ?>
       </p>
	 <h2>
        What is this?
      </h2>
      <p>
        This is a sample Pig Latin translator which I&#8216;ve created to show the basic functionality required for the Final Project in CIS 182 Web Development II. However, it does not include input validation, the CAPTCHA code, or local storage as required. (Please see the final project rubric for all requirements.) 
      </p>
    </form>   
      
      
     
      
         <footer>
      <p>Photo by <A href="https://www.pexels.com/@padrinan">Miguel &Aacute;. Padri&ntilde;&aacute;n from Pexels</A> // Color scheme courtesy of <A href="https://www.design-seeds.com/wander/wanderlust/a-door-hues-63/">design-seeds.com</A>   
        
        </p></footer>
    </main>
   
</body>
</html>