# GitHub Connection Commands

After creating your GitHub repository, run these commands:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/connectspace-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Example:
If your GitHub username is "john123", the command would be:
```bash
git remote add origin https://github.com/john123/connectspace-platform.git
```

## After pushing to GitHub:
1. Your code will be visible on GitHub
2. You can then connect it to Vercel
3. Vercel will automatically deploy your app