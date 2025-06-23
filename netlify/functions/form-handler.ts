export const handler = async (event: any, context: any) => {
  console.log('Form submission received:', event.body);

  try {
    const payload = JSON.parse(event.body);
    const formName = payload.form_name;
    const data = payload.data;

    // Log the submission
    console.log(`New ${formName} submission:`, data);

    // Here you could add email sending logic using a service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Or any other email service

    // For now, we'll just log and return success
    // You can check the function logs in Netlify

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form submission processed',
        formName,
        submittedAt: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error processing form:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process form submission' })
    };
  }
};
