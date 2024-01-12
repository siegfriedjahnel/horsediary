case "insertEntry"://------------------------------
      $day = $_GET["day"];
      $user = $_GET["user"];
      $horse = $_GET["horse"];
      $text = $_GET["text"];
      $table = "horsediary";
      $sql = "INSERT INTO $table (day,user,horse,text) VALUES ('$day','$user','$horse','$text') ";
      
      
      //INSERT INTO table (day, user, horse, text) VALUES('$day','$user','$horse','$text') ON DUPLICATE KEY UPDATE   name="A", age=19
      mysqli_query($fp,$sql);
      if(mysqli_affected_rows($fp) == 1){
            echo "OK";
      }else{
            echo "ERROR";
      }
        break;//----------------------------------------------
        
      case "updateEntry"://---------------------------------------------
      $day = $_GET["day"];
      $user = $_GET["user"];
      $horse = $_GET["horse"];
      $text = $_GET["text"];
      $table = "horsediary";
      $sql = "UPDATE $table SET user='$user', horse='$horse', text='$text' WHERE day='$day'" ;
      $res = mysqli_query($fp,$sql);
      if(mysqli_affected_rows($fp) == 1){
            echo "OK";
      }else{
            echo "ERROR";
      }
        break;//---------------------------------------------------
        
      case "getAllEntries"://---------------------------------------------
________________________________________
