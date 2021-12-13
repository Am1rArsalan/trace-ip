const { trace } = require("./traceroute");
const readline = require("readline");
const geoip = require("geoip-lite");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function ask() {
  return new Promise((resolve) => {
    rl.question("Enter a hostname: ", (answer) => {
      resolve(answer);
    });
  });
}

(async function main() {
  ask()
    .then((url) => {
      trace(url, (err, hops) => {
        if (err) {
          throw err;
        }
        if (hops.length === 0) {
          console.log("No route found");
        } else {
          hops.forEach((hop) => {
            if (hop) {
              const ip = Object.keys(hop)[0];
              const time = hop[Object.keys(hop)[0]];
              const location = geoip.lookup(ip);
              console.log(
                `ip: (${ip}) , time : ${`${time} ms`}, location : ${
                  location?.country
                }, timeZone: ${location?.timezone}`
              );
              console.log("*****************************************");
            }
          });
        }

        process.exit(1);
        console.log(hops);
      });
    })
    .catch((err) => {
      console.log("error: ", err);
      process.exit(0);
    });
})();
