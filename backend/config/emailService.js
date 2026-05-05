const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendInviteEmail = async ({ toEmail, inviterName, inviteToken, workspaceName, workspaceId }) => {
  // If workspaceId is provided it's a workspace invite, otherwise it's a general app invite
  const inviteLink = workspaceId
    ? `${process.env.CLIENT_URL}/join-workspace?token=${inviteToken}&workspaceId=${workspaceId}`
    : `${process.env.CLIENT_URL}/signup?inviteToken=${inviteToken}&email=${toEmail}`;

  const subject = workspaceName
    ? `${inviterName} invited you to join "${workspaceName}" on Task Manager`
    : `${inviterName} invited you to join Task Manager`;

  await resend.emails.send({
    from: "Task Manager <onboarding@resend.dev>",
    to: toEmail,
    subject,
    html: `
      <div style="font-family: Poppins, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1368EC, #0ea5e9); padding: 32px; text-align: center;">
          <div style="width: 48px; height: 48px; background: white; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
            <span style="color: #1368EC; font-size: 20px; font-weight: 700;">T</span>
          </div>
          <h1 style="color: white; font-size: 22px; margin: 0;">Task Manager</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1e293b; font-size: 18px; margin-bottom: 8px;">You're invited! 🎉</h2>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            <strong>${inviterName}</strong> has invited you to join ${workspaceName ? `the <strong>${workspaceName}</strong> workspace on` : ""} Task Manager.
          </p>
          <a href="${inviteLink}"
            style="display: block; background: #1368EC; color: white; text-align: center; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 24px 0;">
            Accept Invitation
          </a>
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            Or copy this link:<br/>
            <span style="color: #1368EC;">${inviteLink}</span>
          </p>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            If you didn't expect this invite, you can ignore this email.
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendInviteEmail };