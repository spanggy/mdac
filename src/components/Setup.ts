import { generateBookmarkletCode } from '../bookmarklet';

export function renderSetup(container: HTMLElement, onBack: () => void): void {
  const bookmarkletCode = generateBookmarkletCode();

  container.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 py-6">
      <div class="flex items-center gap-3 mb-6">
        <button id="btn-back" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h1 class="text-xl font-bold text-gray-900">使用说明</h1>
      </div>

      <div class="space-y-6">
        <!-- Step 1 -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-3">第一步：安装书签小工具</h2>
          <p class="text-sm text-gray-600 mb-4">
            将下方按钮<strong>拖拽</strong>到浏览器的书签栏中。如果看不到书签栏，按 <kbd class="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+Shift+B</kbd> (Windows) 或 <kbd class="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Cmd+Shift+B</kbd> (Mac) 显示。
          </p>
          <a href="${bookmarkletCode}" class="inline-block px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 cursor-grab active:cursor-grabbing no-underline" onclick="event.preventDefault(); alert('请将此按钮拖拽到书签栏，而不是点击它');">
            MDAC 自动填写
          </a>
        </div>

        <!-- Step 2 -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-3">第二步：复制人员信息</h2>
          <p class="text-sm text-gray-600">
            在首页选择要填写的人员，点击<strong>"复制到剪贴板"</strong>按钮。人员的所有信息会被复制到剪贴板中。
          </p>
        </div>

        <!-- Step 3 -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-3">第三步：打开 MDAC 官网并自动填写</h2>
          <ol class="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>打开马来西亚入境卡官网的填写页面</li>
            <li>在表单页面上，点击书签栏中的 <strong>"MDAC 自动填写"</strong></li>
            <li>书签工具会自动从剪贴板读取数据并填入表单</li>
            <li>检查所有字段是否正确，然后手动提交表单</li>
          </ol>
        </div>

        <!-- Notes -->
        <div class="bg-amber-50 rounded-xl border border-amber-200 p-5">
          <h2 class="text-base font-semibold text-amber-800 mb-3">注意事项</h2>
          <ul class="text-sm text-amber-700 space-y-2 list-disc list-inside">
            <li>浏览器可能会请求剪贴板读取权限，请点击"允许"</li>
            <li>如果剪贴板读取失败，会弹出输入框，手动粘贴即可</li>
            <li>自动填写后请<strong>仔细检查</strong>所有字段再提交</li>
            <li>所有数据仅存储在您的浏览器本地，不会上传到任何服务器</li>
            <li>如果 MDAC 官网更新了表单结构，书签工具可能需要更新</li>
          </ul>
        </div>

        <!-- Advanced -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h2 class="text-base font-semibold text-gray-900 mb-3">高级：手动安装书签</h2>
          <p class="text-sm text-gray-600 mb-3">如果拖拽不起作用，可以手动创建书签：</p>
          <ol class="text-sm text-gray-600 space-y-1 list-decimal list-inside mb-3">
            <li>右键书签栏，选择"添加书签"</li>
            <li>名称填写：<code class="bg-gray-100 px-1 rounded">MDAC 自动填写</code></li>
            <li>网址粘贴下方代码</li>
          </ol>
          <div class="relative">
            <textarea id="bookmarklet-code" readonly class="w-full h-24 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono text-gray-600 resize-none">${bookmarkletCode}</textarea>
            <button id="btn-copy-code" class="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">
              复制
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back')!.addEventListener('click', onBack);

  container.querySelector('#btn-copy-code')!.addEventListener('click', async () => {
    const textarea = container.querySelector('#bookmarklet-code') as HTMLTextAreaElement;
    try {
      await navigator.clipboard.writeText(textarea.value);
      const btn = container.querySelector('#btn-copy-code')!;
      btn.textContent = '已复制';
      setTimeout(() => (btn.textContent = '复制'), 2000);
    } catch {
      textarea.select();
      document.execCommand('copy');
    }
  });
}
