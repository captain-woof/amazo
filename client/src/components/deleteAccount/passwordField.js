import styled from 'styled-components'

const PasswordFieldContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	margin: 120px 16px 8px 16px;
`

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
	text-align: center;
`

export default function PasswordField({ fieldValue, setFieldValue }) {
	return (
		<PasswordFieldContainer>
			<Heading>Enter password:</Heading>
			<Field type='password' value={fieldValue} onChange={(e) => { setFieldValue(e.target.value) }}
				placeholder={'Enter password'} />
		</PasswordFieldContainer>
	)
}