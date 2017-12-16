import { fs } from "mz";
import * as AdmZip from "adm-zip";
import fetch from "node-fetch";

const extractZip = (buffer: Buffer, pathInArchive: string) => {
  const zip = new AdmZip(buffer);
  return zip.readAsText(pathInArchive);
};

const sanitizeUrl = (url: string) => {
  if (url.indexOf("http://") === -1 && url.indexOf("http:/") === 0) {
    return "http://" + url.slice(6, url.length);
  } else if (url.indexOf("https://") === -1 && url.indexOf("https:/") === 0) {
    return "https://" + url.slice(7, url.length);
  }
  return url;
};

export default (sourceFile: string, pathInArchive?: string) => {
  const isZip = sourceFile.substr(-4) === ".zip";
  if (sourceFile.indexOf("http") === 0) {
    const sanitizedUrl = sanitizeUrl(sourceFile);
    return fetch(sanitizedUrl, { redirect: "follow" }).then(res => {
      if (isZip && pathInArchive) {
        // console.log(res.toString());
        return res.buffer().then(buffer => extractZip(buffer, pathInArchive));
      } else {
        return res.text();
      }
    });
  } else {
    return fs.readFile(sourceFile).then(buffer => {
      if (isZip && pathInArchive) {
        return extractZip(buffer, pathInArchive);
      } else {
        return buffer.toString();
      }
    });
  }
};
