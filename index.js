const AudioContext = require('web-audio-api').AudioContext
context = new AudioContext
const fs = require('fs')
const exec = require('child_process').exec;
const _ = require('underscore');

var pcmdata = [] ;

const findPeaks = (pcmdata, samplerate) => {
  const interval = 0.05 * 1000;
  let index = 0;
  const step = Math.round( samplerate * (interval/1000) );
  let max = 0 ;
  let prevmax = 0 ;
  const threshhold = 100;
  // let prevdiffthreshold = 120 ;

  //loop through song in time with sample rate
  const samplesound = setInterval(() => {
    if (index >= pcmdata.length) {
      clearInterval(samplesound);
      console.log("finished sampling sound")
      return;
    }

    for(var i = index; i < index + step ; i++){
      max = pcmdata[i] > max ? (pcmdata[i].toFixed(3) * 1000)  : max ;
    }

    // Check data vs threshold
    if (max >= threshhold) {
      console.log(`${max} == Peak!`);
    } else {
      console.log(`${max}`);
    }
    // Play with detecting swings
    // if(max - prevmax >= prevdiffthreshold) { }
    
    prevmax = max;
    max = 0;
    index += step;
  }, interval, pcmdata);
}

const playsound = (soundfile) => {
  // linux or raspi
  // var create_audio = exec('aplay '+soundfile, {maxBuffer: 1024 * 500}, function (error, stdout, stderr) {
  const create_audio = exec('ffplay -nodisp -autoexit ' + soundfile, {maxBuffer: 1024 * 500}, (error, stdout, stderr) => {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

const decodeSoundFile = (soundfile) => {
  console.log("decoding mp3 file ", soundfile, " ..... ")
  fs.readFile(soundfile, function(err, buf) {
    if (err) throw err
    context.decodeAudioData(buf, function(audioBuffer) {
      console.log(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate, audioBuffer.duration);
      pcmdata = (audioBuffer.getChannelData(0));
      samplerate = audioBuffer.sampleRate;
      maxvals = [] ; max = 0 ;
      playsound(soundfile)
      findPeaks(pcmdata, samplerate)
    }, function(err) { throw err })
  })
}

// Example test
const soundDir = "sounds/";
const soundFiles = fs.readdirSync(soundDir);
const fileNumber = Math.floor(Math.random() * soundFiles.length);
//const soundFile = `${soundDir}${soundFiles[fileNumber]}`;
const soundFile = `${soundDir}jingle-bells-christmas-hip-hop.mp3`;
// var soundfile = ["sounds/lifelike.mp3",""
decodeSoundFile(soundFile);
