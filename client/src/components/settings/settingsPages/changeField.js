import styled from 'styled-components'

const Field = styled.input`
	width: 50%;
	max-width: 350px;
	min-width: 220px;
	height: 24px;
	font-family: 'raleway';
`

const Heading = styled.div`
	width: 50%;
	max-width: 350px;
	min-width: 220px;
	font-family: 'oswald';
	font-size: 20px;
	margin-top: 8px;
`

export default function ChangeField({fieldName, fieldText, setFieldText, type='text'}){
	return (
		<>
			<Heading>New {fieldName}:</Heading>
			<Field type={type} value={fieldText} onChange={(e) => {setFieldText(e.target.value)}}
				placeholder={`Enter new ${fieldName}`}/>
		</>
	)
}