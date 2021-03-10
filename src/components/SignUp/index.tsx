import { useCallback, useEffect, useState } from 'react';
import { CircularProgress, MenuItem } from '@material-ui/core';
import { Formik} from 'formik';
import axios from 'axios';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import styles from '../../styles/components/SignUp.module.css';


function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SignUp() {
  const namesStep = ["Dados pessoais", "Endereço", "Dados de contato e login", "Cadastro realizado com sucesso!"]

  const [loading, setLoading] = useState(false);
  const [frameActive, setFrameActive] = useState(1);
  const [lastFrameActive, setLastFrameActive] = useState(1);
  const [stepNameSteActive, setNameStepActive] = useState(namesStep[frameActive-1]);
  const [submittedForm, setSubmittedForm] = useState(false);
  const [sexValue, setSexValue] = useState("");

  const [openAlert, setOpenAlert] = useState(false);
  const [cepInvalid, setCepInvalid] = useState({
    open: false
  });
  const { open } = cepInvalid;

  const openCepInvalid =  () => {
    setCepInvalid({ ...cepInvalid, open: true });
  };

  const handleCloseAlert = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
    setCepInvalid({...cepInvalid, open: false});
  };

  async function onBlurCep(ev, setFieldValue) {
    const { value } = ev.target;
    const cep = value?.replace(/[^0-9]/g, '');

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`, {
        headers: {
          'Content-Type': `text/plain`,
        },
      });

      if(response.status === 200){
        setFieldValue('adress', response.data.logradouro);
        setFieldValue('adress_district', response.data.bairro);
        setFieldValue('adress_city', response.data.localidade);
        setFieldValue('adress_state', response.data.uf);
        handleCloseAlert();
      }
      else{
        openCepInvalid();
      }
    } catch (err) {
      openCepInvalid();
    } finally {
      setLoading(false);
    };
  }

  useEffect(() => {
    setNameStepActive(namesStep[frameActive-1])
  }, [frameActive]);


  const nextStep = useCallback(() => {
    setLastFrameActive(frameActive);
    setFrameActive(frameActive+1);
  }, [frameActive]);

  const previousStep = useCallback(() => {
    setLastFrameActive(lastFrameActive === 1? 1: lastFrameActive-1);
    setFrameActive(lastFrameActive);
  }, [frameActive]);


  const handleSubmit = async ({name, last_name, birth_date, cpf, rg, cep, adress,
    adress_number, adress_district, adress_city, adress_state, email, phone_number, 
    telephone_number, password}) => {
    setLoading(true);
      try{
        const sex = sexValue;
        const response = await axios.post('/api/users', 
          {name, 
          last_name, 
          birth_date, 
          sex, 
          cpf, 
          rg, 
          cep, 
          adress,
          adress_number, 
          adress_district, 
          adress_city, 
          adress_state, 
          email, 
          phone_number, 
          telephone_number, 
          password}
        );
        // router.push('/')
        setNameStepActive(namesStep[namesStep.length-1]);
        setSubmittedForm(true);
      } catch(err){
        console.log(err.message);
      } finally{
        setLastFrameActive(1);
        setLoading(false);
      }
  }

  return (
    <div className={styles.containerSignUp}>
      <Snackbar 
        open={open} 
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity="warning">
          CEP inválido. Por favor, tente novamente.
        </Alert>
      </Snackbar>

      <div className={styles.step}>
        <span>{stepNameSteActive}</span>
        <div></div>
      </div>

      {!submittedForm? (
        <div className={styles.containerForm}>  
         <Formik
           initialValues={{
             name: '',
             last_name: '',
             birth_date: '',
             sex: '',
             cpf: '',
             rg: '',
             cep: '',
             adress: '',
             adress_number: '',
             adress_district: '',
             adress_city: '',
             adress_state: '',
             email: '',
             confirm_email: '',
             phone_number: '',
             telephone_number: '',
             password: '',
             confirm_password: '',
           }}
           // validationSchema={Validations('prospectos')}
           onSubmit={async (values, { setSubmitting }) => {
               if(frameActive === 3){
               setSubmitting(true);
               // setForm1Values(values);
               await handleSubmit(values);
               setSubmitting(false);
               }
               else{
                 nextStep();
               }
           }}
         >
           {}
           {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
             <>
             <div className={frameActive === 1 ? '' : styles.invisible}>
               <form
                 onSubmit={e => {
                   e.preventDefault();
                   handleSubmit();
                 }}
                 className={styles.formContent}
               >
                 <div>
                   <TextField
                     name="name"
                     type="text"
                     variant="outlined"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     value={values.name}
                     required
                     label="Nome"
                     fullWidth={true}
                   />
                 </div>

                 <div>
                   <TextField
                     name="last_name"
                     type="text"
                     variant="outlined"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     value={values.last_name}
                     required
                     label="Sobrenome"
                     fullWidth={true}
                   />
                 </div>

                 <div className={styles.twoColumnsForm}>

                   <div>
                     <TextField
                       name="birth_date"
                       type="date"
                       variant="outlined"
                       onChange={handleChange}
                       required
                       label="Data de nascimento"
                       value={values.birth_date}
                       onBlur={handleBlur}
                       InputLabelProps={{
                         shrink: true,
                       }}
                       fullWidth={true}
                     />
                   </div>

                   <div>
                     <FormControl variant="outlined"  fullWidth={true}>
                       <InputLabel>Sexo:</InputLabel>
                       <Select 
                         value={sexValue} 
                         label="Sexo" 
                         onChange={e => setSexValue(e.target.value.toString())} 
                         fullWidth={true}
                         className={styles.select}
                       >
                           <MenuItem key={"fem"} value={"feminino"}>
                             Feminino
                           </MenuItem>
                           <MenuItem key={"mas"} value={"masculino"}>
                             Masculino
                           </MenuItem>
                           <MenuItem key={"nb"} value={"nao_binario"}>
                             Não-binário
                           </MenuItem>
                           <MenuItem key={"outros"} value={"outros"}>
                             Outros
                           </MenuItem>
                       </Select>
                     </FormControl>
                   </div>
                 </div>
                 
                 <div className={styles.twoColumnsForm}>
                   <div>
                     <TextField
                       name="cpf"
                       type="number"
                       variant="outlined"
                       onChange={handleChange}
                       required
                       label="CPF"
                       value={values.cpf}
                       onBlur={handleBlur}
                       fullWidth={true}
                     />
                   </div>

                   <div>
                     <TextField
                       name="rg"
                       type="number"
                       variant="outlined"
                       onChange={handleChange}
                       label="RG"
                       value={values.rg}
                       onBlur={handleBlur}
                       fullWidth={true}
                     />
                   </div>
                 </div>

                 <button type="submit" className={styles.buttonOutlined}>         
                   <span>Próximo passo</span>
                 </button>
                 
               </form>
             </div>

             <div className={frameActive === 2 ? '' : styles.invisible}>
               <form
                 onSubmit={e => {
                   e.preventDefault();
                   handleSubmit();
                 }}
                 className={styles.formContent}
               >
                 <div>
                   <TextField
                     name="cep"
                     type="text"
                     variant="outlined"
                     onChange={handleChange}
                     onBlur={(ev) => onBlurCep(ev, setFieldValue)}
                     value={values.cep}
                     required
                     label="CEP"
                     fullWidth={true}
                   />
                 </div>

                 <div>
                   <TextField
                     name="adress"
                     type="text"
                     variant="outlined"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     value={values.adress}
                     required
                     label="Endereço"
                     fullWidth={true}
                     InputLabelProps={{
                       shrink: true,
                     }}
                   />
                 </div>

                 <div className={styles.twoColumnsForm}>

                   <div>
                     <TextField
                       name="adress_number"
                       type="number"
                       variant="outlined"
                       onChange={handleChange}
                       required
                       label="Número"
                       value={values.adress_number}
                       onBlur={handleBlur}
                       fullWidth={true}
                       InputLabelProps={{
                         shrink: true,
                       }}
                     />
                   </div>

                   <div>
                     <TextField
                       name="adress_district"
                       type="text"
                       variant="outlined"
                       onChange={handleChange}
                       required
                       label="Bairro"
                       value={values.adress_district}
                       onBlur={handleBlur}
                       fullWidth={true}
                       InputLabelProps={{
                         shrink: true,
                       }}
                     />
                   </div>

                 </div>
                 
                 <div className={styles.twoColumnsForm}>
                   <div>
                     <TextField
                       name="adress_city"
                       type="text"
                       variant="outlined"
                       onChange={handleChange}
                       required
                       label="Cidade"
                       value={values.adress_city}
                       onBlur={handleBlur}
                       fullWidth={true}
                       InputLabelProps={{
                         shrink: true,
                       }}
                     />
                   </div>

                   <div>
                     <TextField
                       name="adress_state"
                       type="text"
                       variant="outlined"
                       onChange={handleChange}
                       label="Estado"
                       value={values.adress_state}
                       onBlur={handleBlur}
                       fullWidth={true}
                       InputLabelProps={{
                         shrink: true,
                       }}
                     />
                   </div>
                 </div>

                 <button type="submit" className={styles.buttonOutlined}>
                   <span>Próximo passo</span>
                 </button>
                 
                 <span onClick={previousStep} className={styles.buttonReturn}> {`<-`} voltar</span>

               </form>      

             </div>
             
             <div className={frameActive === 3 ? '' : styles.invisible}>
               <form
                 onSubmit={e => {
                   e.preventDefault();
                   handleSubmit();
                 }}
                 className={styles.formContent}
               >
                 <div>
                   <TextField
                     focused
                     name="email"
                     type="email"
                     variant="outlined"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     value={values.email}
                     required
                     label="Email"
                     fullWidth={true}
                   />
                 </div>

                 <div>
                   <TextField
                     name="confirm_email"
                     type="email"
                     variant="outlined"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     value={values.confirm_email}
                     required
                     label="Confirmar email"
                     fullWidth={true}
                   />
                 </div>

                 <div className={styles.twoColumnsForm}>

                   <div>
                     <TextField
                       name="phone_number"
                       type="number"
                       variant="outlined"
                       onChange={handleChange}
                       required
                       label="Celular"
                       value={values.phone_number}
                       onBlur={handleBlur}
                       fullWidth={true}
                     />
                   </div>

                   <div>
                     <TextField
                       name="telephone_number"
                       type="number"
                       variant="outlined"
                       onChange={handleChange}
                       label="Telefone"
                       value={values.telephone_number}
                       onBlur={handleBlur}
                       fullWidth={true}
                     />
                   </div>

                 </div>
                 
                 <div className={styles.twoColumnsForm}>
                   <div>
                     <TextField
                       name="password"
                       type="password"
                       variant="outlined"
                       onChange={handleChange}
                       required
                       label="Senha"
                       value={values.password}
                       onBlur={handleBlur}
                       fullWidth={true}
                     />
                   </div>

                   <div>
                     <TextField
                       name="confirm_password"
                       type="password"
                       variant="outlined"
                       onChange={handleChange}
                       required
                       label="Confirmar senha"
                       value={values.confirm_password}
                       onBlur={handleBlur}
                       fullWidth={true}
                     />
                   </div>
                 </div>

                 <button type="submit" className={styles.buttonOutlined} disabled={loading}>
                   {loading ? (
                     <div>
                       <CircularProgress size={15} style={{ color: '#9e9e9e' }} />
                     </div>
                   ) : (
                     <span>Finalizar cadastro</span>
                   )}
                 </button>

                 <span onClick={previousStep} className={styles.buttonReturn}> {`<-`} voltar</span>
                 
               </form>
             </div>
             </>
           )}
         </Formik>
       </div>
      ):
      (
        <div className={styles.containerForm}>  
          <div className={styles.containerSuccess}>
            <span>Obrigad@!</span>
            <span>
              <a href="https://www.bemol.com.br/login">
                ir até a área de login {`->`}
              </a>
            </span>
          </div>
        </div>
        
      )}
    </div>
  );
};

export default SignUp;
