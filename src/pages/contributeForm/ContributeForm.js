import styles from './ContributeForm.module.css';
import useFormFields from '../../hooks/useFormFields';
import { ReactComponent as MailboxSVG } from '../../assets/images/mailbox.svg';
import TextInput from '../../components/inputFields/TextInput';
import MainButton from '../../components/button/MainButton';

function ContributeForm() {

   const initialValues = {
      name: '',
      phone_number: '',
      email: '',
      content: '',
   }
   const { fields, handleChange } = useFormFields(initialValues);

   return (
      <div className='container'>
         <div className={styles.content_wrap}>

            {/* ---------------- Description ---------------- */}
            <div>
               <h2> Contribute with us </h2>
               <p> Spread your educational platform content, send us and we will contact you </p>
            </div>

            {/* ------------------ Content ------------------ */}
            <div className={styles.content}>
               <form className={styles.input_form}>

                  {/* Input Fields */}
                  <div className={styles.input_row}>
                     <TextInput
                        label="Name"
                        value={fields['name']}
                        onChange={(value) => handleChange('name', value)}
                     />
                     <TextInput
                        label="Phone Number"
                        value={fields['phone_number']}
                        placeholder="e.g. 966 xxx xxx xxx"
                        onChange={(value) => handleChange('phone_number', value)}
                     />
                  </div>
                  <TextInput
                     label="Email"
                     value={fields['email']}
                     onChange={(value) => handleChange('email', value)}
                  />
                  <div className={styles.textarea_container}>
                     <TextInput
                        label="Content"
                        value={fields['content']}
                        isMulitLine={true}
                        onChange={(value) => handleChange('content', value)}
                     />
                  </div>

                  {/* Send Button */}
                  <div className={styles.btn_container}>
                     <MainButton
                        label="Send"
                        onClick={() => console.log("Button Clicked!")}
                     />
                  </div>
               </form>

               {/* Image */}
               <div className={styles.img_container}>
                  <MailboxSVG className={styles.img} />
               </div>
            </div>

         </div>
      </div>
   );
}

export default ContributeForm;