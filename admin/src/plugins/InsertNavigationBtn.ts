import { ButtonView, Plugin } from 'ckeditor5';

export class InsertNavigationBtn extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('insertNavigation', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Insert Text Node',
        icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>`,
        tooltip: true,
      });

      view.on('execute', () => {
        editor.model.change(writer => {
          const selection = editor.model.document.selection;
          const position = selection.getFirstPosition();
          const parent = position.parent;

          // Ensure we're working at block level
          const block =
            parent.is('element') &&
            editor.model.schema.checkChild(position.parent.parent, parent.name)
              ? parent
              : editor.model.document.selection.getSelectedBlock();

          if (block) {
            // Create a new paragraph with the desired text
            const newParagraph = writer.createElement('paragraph');
            writer.insertText('{{navigation}}', newParagraph, 0);

            // Insert it after the current block
            writer.insert(newParagraph, block, 'after');

            // Remove the old block
            writer.remove(block);

            // Move selection into the new paragraph
            writer.setSelection(newParagraph, 1);
          }
        });
      });

      return view;
    });
  }
}
