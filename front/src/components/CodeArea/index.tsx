import { TextField } from "@mui/material";


interface CodeAreaProps {
    url: string;
    name: string;
}



const CodeArea : React.FC<CodeAreaProps> = (props) => {

    const textCode =`
    <iframe
        src="${props.url}"
        title="Bot: ${props.name}"
        width="360"
        height="650"
    ></iframe>`;
    
    return(
        <TextField
            value={textCode}
            autoFocus
            name="iframe_code"
            multiline
            rows={8}
            variant="outlined"
            fullWidth
            inputProps={{ readOnly: true }}
        />
    );
}


export default CodeArea;