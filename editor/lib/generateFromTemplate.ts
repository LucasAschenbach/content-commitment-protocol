import { Readable } from 'stream';

// generateFromTemplate(
//   '../init/src/main.nr.template',
//   { content_size: '10', old_content_size: '10', last_op_args: '0' },
// );

export async function generateFromTemplate(templatePath: string, args: { [key: string]: string }): Promise<Readable> {
  console.log("templatePath: ", templatePath);
  if (!templatePath.endsWith('.template')) {
    throw new Error(`The file at "${templatePath}" does not end with .template`);
  }

  const content = await fetch(new URL(templatePath, import.meta.url)).then(res => res.text());

  const templateRegex = /<%=\s*(\w+)\s*%>/g;
  let match;
  while ((match = templateRegex.exec(content)) !== null) {
    if (!args.hasOwnProperty(match[1])) {
      throw new Error(`Keyword '${match[1]}' not specified in keywords map.`);
    }
  }

  let replacedContent = content;
  Object.keys(args).forEach(arg => {
    const regex = new RegExp(`<%=\\s*${arg}\\s*%>`, 'g');
    replacedContent = replacedContent.replace(regex, args[arg]);
  });

  // Create a ReadableStream from the replaced content
  const stream = new Readable();
  stream.push(replacedContent); // Push the content to the stream
  stream.push(null); // Signify the end of the stream (no more data)

  console.log("stream: ", stream);

  return stream;
}
