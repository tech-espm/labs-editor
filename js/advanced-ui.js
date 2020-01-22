"use strict";

$(document.body).prepend(
`<div class="modal fade" tabindex="-1" role="dialog" id="modalSave">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" data-string="aria-label|Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" data-string="text|Save"></h4>
			</div>
			<div class="modal-body">
				<div class="form-group no-margin-bottom">
					<label for="modalSaveFileName" data-string="text|FileName"></label>
					<input type="text" class="form-control" id="modalSaveFileName" spellcheck="false" autocomplete="off" />
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline btn-default" data-dismiss="modal" data-string="text|Cancel"><i class="fa fa-margin fa-times"></i></button>
				<button type="button" class="btn btn-primary" id="modalSaveOk" data-string="text|Save"><i class="fa fa-margin fa-check"></i></button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="modalRenameFile">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" data-string="aria-label|Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" data-string="text|Rename"></h4>
			</div>
			<div class="modal-body">
				<div class="form-group no-margin-bottom">
					<label for="modalRenameFileName" data-string="text|FileName"></label>
					<input type="text" class="form-control" id="modalRenameFileName" spellcheck="false" autocomplete="off" />
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline btn-default" data-dismiss="modal" data-string="text|Cancel"><i class="fa fa-margin fa-times"></i></button>
				<button type="button" class="btn btn-primary" id="modalRenameFileOk" data-string="text|Rename"><i class="fa fa-margin fa-check"></i></button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="modalDeleteFile">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" data-string="aria-label|Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" data-string="text|DeleteFile"></h4>
			</div>
			<div class="modal-body">
				<div id="modalDeleteFileLabel"></div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline btn-default" data-dismiss="modal" data-string="text|Cancel"><i class="fa fa-margin fa-times"></i></button>
				<button type="button" class="btn btn-danger" id="modalDeleteFileOk" data-string="text|Delete"><i class="fa fa-margin fa-check"></i></button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="modalCreateDocument">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" data-string="aria-label|Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" data-string="text|CreateDocument"></h4>
			</div>
			<div class="modal-body">
				<div class="form-group no-margin-bottom">
					<label for="modalCreateDocumentFileName" data-string="text|FileName"></label>
					<input type="text" class="form-control" id="modalCreateDocumentFileName" spellcheck="false" autocomplete="off" />
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline btn-default" data-dismiss="modal" data-string="text|Cancel"><i class="fa fa-margin fa-times"></i></button>
				<button type="button" class="btn btn-primary" id="modalCreateDocumentOk" data-string="text|Create"><i class="fa fa-margin fa-check"></i></button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="modalTheme">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" data-string="aria-label|Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" data-string="text|Theme"></h4>
			</div>
			<div class="modal-body">
				<div class="form-group no-margin-bottom">
					<label for="modalThemeSelect" data-string="text|Theme"></label>
					<select size="1" class="form-control" id="modalThemeSelect">
						<option value="ace/theme/chrome">Chrome</option>
						<option value="ace/theme/dracula">Dracula</option>
						<option value="ace/theme/eclipse">Eclipse</option>
						<option value="ace/theme/labs">Labs</option>
						<option value="ace/theme/mono_industrial">Mono Industrial</option>
						<option value="ace/theme/monokai">Monokai</option>
						<option value="ace/theme/sqlserver">SQL Server</option>
						<option value="ace/theme/textmate">TextMate</option>
					</select>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline btn-default" data-dismiss="modal" data-string="text|Cancel"><i class="fa fa-margin fa-times"></i></button>
				<button type="button" class="btn btn-primary" id="modalThemeOk" data-string="text|Save"><i class="fa fa-margin fa-check"></i></button>
			</div>
		</div>
	</div>
</div>`
);
