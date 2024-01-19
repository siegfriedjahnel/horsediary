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
token:
ebx9fftXU_1HWz7CMQr-i6:APA91bHk9XsM9kPyEQJ1Lfo4KQ_TcNXD0K8GP919pY7cP0xAa3Q9u1SoKmMr4QOnc5_tbEAjkKo_vmVe4xmGXmHEit5iw_54-FBsydKrYJXeMbtuqKIa8Kc4QbSTWFZzN5gRJwwXpR5o