module.exports = {
  apps: [
    {
      name: 'EduApply',
      script: 'dist/index.js',
      max_memory_restart: '250M',
      watch: false,
      env: {
        COMMON_VARIABLE: 'true',
        NODE_ENV: 'development'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3019,
        DB_NAME: 'eduapply',
        S3_BUCKET: 'doerz-fitty',
        CLOUDFRONT_DOMAIN: 'https://d2vkhjsuk6abaq.cloudfront.net/',
        AWS_SECRETS_NAME: "dev",
        AWS_REGION: 'us-east-2',
        SMTP_FROM: 'noreply@doerz.dev'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 80,
        DB_NAME: 'eduapply',
        S3_BUCKET: 'prodbackend-eduapplybucket-7ggkiu585qed',
        CLOUDFRONT_DOMAIN: 'https://d2m1bifm55oz01.cloudfront.net/',
        AWS_SECRETS_NAME: "prod",
        AWS_REGION: 'eu-west-1',
        SMTP_FROM: 'noreply@doerz.dev',
        ADMIN_BASE_URL: 'https://production.d3qeqtuauaiow3.amplifyapp.com',
        STUDENT_WEB_PORTAL_BASE_URL: 'https://production.d3i8plfvdjce8p.amplifyapp.com',
        AGENT_WEB_PORTAL_BASE_URL: 'https://production.d3b69yrovju9km.amplifyapp.com'
      },
    },
  ],
  deploy: {
    dev: {
      user: 'ec2-user',
      host: 'dev.doerz.tech',
      key: '~/.ssh/aws-dev.pem',

      ref: 'origin/stagging',
      repo: 'git@gitlab.com:doerz.tech/eduapply/backend.git',
      path: '/home/ec2-user/eduapply',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && npm run start-development',
      'pre-setup': 'npm i -g @loopback/cli && npm i -g @loopback/build',

      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
      env: {
        NODE_ENV: 'development',
      },
    }
  }
};



