export function fileParser(buffer) {
  const data = String.fromCharCode(...buffer);

  const regex = /(?<=((Title:|Release Year:|Format:|Stars:)\s)).+/gm;
  const regexData = data.match(regex);

  const arr = [];
  for (let i = 0; i < regexData.length - 3; i += 4) {
    arr.push({
      title: regexData[i].trim(),
      year: regexData[i + 1].trim(),
      format: regexData[i + 2].trim(),
      actors: regexData[i + 3].split(', ').map((actor) => actor.trim()),
    });
  }

  return arr;
}
