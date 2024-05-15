import { useState, useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognitionHook = {
  listening: boolean;
  transcript: string;
  startListening: (language: string) => void;
  stopListening: () => void;
};

type SpeechRecognitionResult = {
  item: (index: number) => { transcript: string };
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResult[];
  error?: SpeechRecognitionError;
};

type SpeechRecognitionError = {
  error: string;
};

const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  let recognition:
    | typeof window.SpeechRecognition
    | typeof window.webkitSpeechRecognition = null;

  const startListening = (language: string) => {
    recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = language;
    recognition.onresult = handleResult;
    recognition.onend = () => {
      setListening(false);
    };
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  const handleResult = (event: SpeechRecognitionEvent) => {
    const result = event.results[0];
    if (result) {
      const transcript = result.item(0).transcript;
      setTranscript(transcript);
    }
  };

  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  return { listening, transcript, startListening, stopListening };
};

export default useSpeechRecognition;
