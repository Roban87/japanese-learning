/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';
import Lottie from "lottie-react";
import checkmarkAnimation from '../assets/92460-checkmark-animation.json';

import './main.style.scss';

interface Word {
  Magyar: string;
  Hiragana: string;
  Romaji: string;
}

const typeOptions = ['Magyar', 'Hiragana', 'Romaji'];

export const MainScreen: React.FC = () => {
  const [fileName, setFileName] = useState<string>('');

  const [dictionary, setDictionary] = useState<Word[]>([]);
  const [word, setWord] = useState<Word>({
    Magyar: '',
    Hiragana: '',
    Romaji: '',
  });

  const [type, setType] = useState<string>('Romaji');
  const [lastClick, setLastClick] = useState<string>('Romaji');
  const [answer, setAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [isAnswerPassed, setIsAnswerPassed] = useState<boolean>(false);

  const getDictionary = (event: any) => {
    const file = event.target.files[0];

    const name = file.name?.split('.')[0];
    setFileName(name);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results: any) => {
        setDictionary(results.data);
      }
    });
  };

  const getWord = () => {
    const maxNumber = dictionary.length - 1;
    const number = _.random(0, maxNumber, false);
    setWord(dictionary[number]);
  }

  const handleChangeOfTypeAndWord = (type: string) => {
    setAnswer('');
    setIsAnswerPassed(false);
    let typeToSet: string = type;

    if (type === 'Random') {
      const randomIndex = Math.floor(Math.random() * typeOptions.length)
      typeToSet = typeOptions[randomIndex];
    }
    setType(typeToSet);
    setLastClick(type);
    getWord();
  };

  const handleAnswerChange = (event: React.FormEvent<HTMLInputElement>) => {
    setAnswer(event.currentTarget.value);
  };

  const checkAnswer = () => {
    if (!answer || isAnswerPassed) {
      return setIsCorrect(undefined);
    }

    if (answer === word[type as keyof Word]) {
      return setIsCorrect(true);
    }
    return setIsCorrect(false);
  };

  const showAnswer = () => {
    setIsAnswerPassed(true);
    setAnswer(word[type as keyof Word])
  }

  // useEffect(() => getDictionary(), []);

  useEffect(() => getWord(), [dictionary]);

  useEffect(() => checkAnswer(), [answer]);

  return <div className="container MainScreen">
    <div className="row justify-content-stretch wrapper">
      <div className='col-2' />

      <div className="col-18 content-main-wrapper">
        <div>
          <div className="row">
            <div className="col">
              <h1>Nihon GO</h1>
              <h3>szógyakorló</h3>
            </div>
          </div>

          <div className={'row settings-wrapper'}>

            <div className={'col type-setting'}>

              <div className="row">
                <div className="col">
                  <h5>Írásmód</h5>

                  <div className={'type-setting-controls'}>
                    <button
                      onClick={() => lastClick !== 'Magyar' ? handleChangeOfTypeAndWord('Magyar') : null}
                      className={`button type-setting-button ${ lastClick === 'Magyar' ? 'selected' : '' }`}
                    >
                      <p>Magyar</p>
                    </button>

                    <button
                      onClick={() => lastClick !== 'Hiragana' ? handleChangeOfTypeAndWord('Hiragana') : null}
                      className={`button type-setting-button ${ lastClick === 'Hiragana' ? 'selected' : '' }`}
                    >
                      <p>Hiragana</p>
                    </button>

                    <button
                      onClick={() => lastClick !== 'Romaji' ? handleChangeOfTypeAndWord('Romaji') : null}
                      className={`button type-setting-button ${ lastClick === 'Romaji' ? 'selected' : '' }`}
                    >
                      <p>Romaji</p>
                    </button>

                    <button
                      onClick={() => lastClick !== 'Random' ? handleChangeOfTypeAndWord('Random') : null}
                      className={`button type-setting-button ${ lastClick === 'Random' ? 'selected' : '' }`}
                    >
                      <p>Random</p>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div className={'row content-wrapper'}>

            <div className={'col word-box'}>
              <label htmlFor="Magyar" className={`${ type === 'Magyar' && 'active' }`}>Magyar</label>
              <input type="text" id="Magyar"
                disabled={!dictionary.length || type !== 'Magyar' || isAnswerPassed}
                value={`${ !dictionary.length
                  ? ''
                  : type !== 'Magyar'
                    ? word?.Magyar
                    : answer }`}
                onChange={(event) => handleAnswerChange(event)}
              />
            </div>

            <div className={'col word-box'}>
              <label htmlFor="Hiragana" className={`${ type === 'Hiragana' && 'active' }`}>Hiragana</label>
              <input type="text" id="Hiragana"
                disabled={!dictionary.length || type !== 'Hiragana' || isAnswerPassed}
                value={`${ !dictionary.length
                  ? ''
                  : type !== 'Hiragana'
                    ? word?.Hiragana
                    : answer }`}
                onChange={(event) => handleAnswerChange(event)}
              />
            </div>

            <div className={'col word-box'}>
              <label htmlFor="Romaji" className={`${ type === 'Romaji' && 'active' }`}>Romaji</label>
              <input type="text" id="Romaji"
                disabled={!dictionary.length || type !== 'Romaji' || isAnswerPassed}
                value={`${ !dictionary.length
                  ? ''
                  : (type === 'Magyar') || (type === 'Hiragana' && (isAnswerPassed || isCorrect))
                    ? word?.Romaji
                    : type === 'Romaji'
                      ? answer
                      : '' }`}
                onChange={(event) => handleAnswerChange(event)}
              />
            </div>

            <div className={'check-status'}>
              {
                isCorrect === undefined
                  ? null
                  : isCorrect
                    ? <Lottie
                      animationData={checkmarkAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: 40, height: 40 }}
                    />
                    : <p>&#10060;</p>
              }
            </div>


          </div>

          <div className="row">
            <div className='col'>

              <div className="control-wrapper">
                <button className="button control-button pass-button" onClick={() => showAnswer()}>
                  <p>Passz! :(</p>
                </button>

                <button className="button control-button new-word-button" onClick={() => handleChangeOfTypeAndWord(lastClick)} >
                  <p>Új szót kérek</p>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className='col-2'>
        <div className='file-input-wrapper'>
          <input
            className={'file-input'}
            accept='.csv, .xls, .xlsx, application/vnd.ms-excel, text/csv
            application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            type="file"
            multiple={false}
            onChange={(event) => getDictionary(event)}
          />
          <span className='fw-600'>Szótár hozzáadása</span>
          <span>Kattints vagy húzd ide</span>
        </div>

        {!!dictionary.length && <div className='mt-3'>
          <p>
            <span className='fw-600'>File: </span>
            <span>{fileName}</span>
          </p>

          <p>
            <span className='fw-600'>Szavak száma: </span>
            <span>{dictionary.length}</span>
          </p>
        </div>}
      </div>
    </div>

  </div>
}