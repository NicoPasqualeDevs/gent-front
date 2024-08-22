import { StyledLinkButton } from "../styledComponents/Buttons";

interface ButtonProps {
    url : string;
    text : string; 
}

const ButtonOpenURL : React.FC<ButtonProps> = (props) => {
    
    const url_base = "https://nicoiatest.com";
    
    const handleClick = () => {    
        console.log(url_base + props.url);
        window.open(url_base + props.url, '_blanck');
    };  
    return(
        <StyledLinkButton onClick={handleClick}>
            { props.text }
        </StyledLinkButton>
    );
};

export default ButtonOpenURL;