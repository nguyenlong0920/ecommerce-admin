import {PuffLoader} from "react-spinners";

export default function Spinner({fullwidth}) {
    if (fullwidth) {
        return (
            <div className='w-full flex justify-center'>
                <PuffLoader color ={'#1E3A8A'} size={75}/>
            </div>
        )
    }
    return (
        <PuffLoader color ={'#1E3A8A'} size={75}/>
    );
}
