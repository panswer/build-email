import { useRef, useState } from 'react';
import './App.css';

import EmailEditor from 'react-email-editor';

function App() {
  const [template, setTemplate] = useState();
  const [urlFile, setUrlFile] = useState();
  const [fileName, setFileName] = useState('schema');

  const emailEditorRef = useRef(null);

  const getLink = e => new Promise((resolve, reject) => {
    try {
      emailEditorRef
        .current
        .editor
        .saveDesign(design => {
          let data = new Blob([JSON.stringify(design)]);

          let urlData = window.URL.createObjectURL(data);

          resolve(urlData);
        });
    } catch (error) {
      console.error(error);
      resolve();
    }
  });

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml(data => {
      const { design, html } = data;
      console.log('design', design);
      console.log('exportHtml', html);
    });
  }

  const loadJSON = e => {
    console.log('Loading file ...');
    const templateFile = e.target.files[0];
    console.log(templateFile);

    let reading = new FileReader();

    reading.onload = e => {
      setFileName(templateFile.name);
      const template = JSON.parse(e.target.result);

      emailEditorRef.current.editor.loadDesign(template);
    };

    reading.readAsText(templateFile);
  }

  const onLoad = e => {
  }

  const onReady = () => {
    emailEditorRef.current.editor.saveDesign(design => {

      if (!template) {
        setTemplate(design);

        let data = new Blob([JSON.stringify(design)]);
        setUrlFile(window.URL.createObjectURL(data));
      }
    });
  }

  return (
    <>
      <div className='container-email-editor'>
        <div>
          <button onClick={exportHtml}>Export HTML</button>
          <input type="file" name="myModel" id="myModel" accept='.json' onChange={e => {
            loadJSON(e);
          }} />
          {
            urlFile ? <>
              {/* <a href={urlFile} download={`${fileName}.json`}>Download</a> */}
              <button onClick={async e => {
                e.preventDefault();

                let myLink =await getLink(e);

                if(myLink){
                  let myA = document.createElement('a');

                  myA.href = myLink;
                  myA.download = `${fileName}.json`;
                  myA.click();
                }
              }} >Download</button>
              <input type="text" name="fileName" id="fileName" value={fileName} onChange={e => {
                e.preventDefault();
                setFileName(e.target.value);
              }} />
            </> : null
          }
        </div>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
      </div>
    </>
  );
}

export default App;
